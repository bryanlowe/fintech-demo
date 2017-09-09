var palette = require('../utils/palette.js');
var mongoose = require('mongoose');
var model = mongoose.model('BrandShare');

model.schema.methods.createAggregate = function(time_frame){
	var result = [
		{
			'$unwind': '$sale_statement'
		},
    { 
      '$project': { 
        '_id': 0, 
        'brand': 1,
        'sale_statement.units': 1,
        'sale_statement.revenue': 1,
        'sale_statement.time_frame.week_start': 1,
        'sale_statement.time_frame.month_start': 1,
        'sale_statement.time_frame.year_start': 1,
        'sale_statement.time_frame.iso_date': 1,
        'product': 1
      }
    },
    {   
      '$group': {
        '_id': {
          'brand': '$brand', 
          'time_frame': '$sale_statement.time_frame.'+time_frame+'_start',
          'product': '$product',
        }, 
        'units': {
          '$sum': '$sale_statement.units'
        },
        'revenue': {
          '$sum': '$sale_statement.revenue'
        },
        'last_sale_date': { 
          '$last': "$sale_statement.time_frame.iso_date" 
        }
      }
    },
    {
      '$sort': {
        '_id.brand': 1
      }
    },
    {
      '$project': {
        'doc': {
          'brand': '$_id.brand',
          'time_frame': '$_id.time_frame',
          'product': '$_id.product',
          'units': '$units',
          'revenue': '$revenue',
          'last_sale_date': '$last_sale_date'
        }
      }
    },
    { 
      '$group':{
        '_id': '$doc.last_sale_date',
        'unit_total': {
          '$sum': '$doc.units'
        },
        'revenue_total': {
          '$sum': '$doc.revenue'
        },
        'dataset':{
          '$push': '$doc'
        }
      }
    },
    {
      '$sort': {
        '_id': 1
      }
    }
  ];
	return result;
}

// create table data function
model.schema.methods.createDataTable = function(model_data){
  let table_data = {dataArray: [], rows: ['Brand'], columns: ['Date'], aggregationDimension: 'Revenue', aggregator: 'sum', rowHeader: 'Brand'};

  // Create the table input
  let tempArray = model_data.map(function(obj){
    return obj.dataset;
  });
  tempArray = [].concat.apply([], tempArray);
  table_data.dataArray = tempArray.map(function(obj){
    let result = {};
    result['Brand'] = obj.brand;
    result['Date'] = obj.time_frame;
    result['Units'] = obj.units;
    result['Revenue'] = obj.revenue;
    for(let i = 0, ii = obj.product.length; i < ii; i++){
      result[obj.product[i].spec_type] = obj.product[i].spec_value;
    }
    return result;
  });
  
  table_data.options = {
    rows: ['Brand'],
    cols: ['Date'],
    vals: ['Units']
  };
  return table_data;
}

// creates line graph data
model.schema.methods.createLineGraphData = function(table_data){
  var graph_data = {data: {labels: [], datasets: []}, options: {responsive: true}};

  // Create the graph labels
  graph_data.data.labels = table_data.header;

  // add colors
  var colors = palette('tol-rainbow', table_data.rows.length).map(function(hex) {
    return '#' + hex;
  });

  // Create the graph data
  for(var i = 0, ii = table_data.rows.length; i < ii; i++){
    var dataset = {};
    dataset['fill'] = false;
    dataset['label'] = table_data.rows[i][0];
    dataset['data'] = table_data.rows[i].slice(1, table_data.rows[i].length).map(function(value){
      return Number(value.replace('$', '').replace('%', '').replace(/,/g, ''));
    });
    dataset['backgroundColor'] = colors[i];
    dataset['borderColor'] = colors[i];
    graph_data.data.datasets.push(dataset);
  }
  return graph_data;
}

// creates bar graph data
model.schema.methods.createBarGraphData = function(table_data){
  var graph_data = {data: {labels: [], datasets: []}, options: {responsive: true, scales: {yAxes: [{ticks: {beginAtZero: true}}]}}};

  // Create the graph labels
  graph_data.data.labels = table_data.header;

  // add colors
  var colors = palette('tol-rainbow', table_data.rows.length).map(function(hex) {
    return '#' + hex;
  });

  // Create the graph data
  for(var i = 0, ii = table_data.rows.length; i < ii; i++){
    var dataset = {};
    dataset['label'] = table_data.rows[i][0];
    dataset['data'] = table_data.rows[i].slice(1, table_data.rows[i].length).map(function(value){
      return Number(value.replace('$', '').replace('%', '').replace(/,/g, ''));
    });
    dataset['backgroundColor'] = colors[i];
    graph_data.data.datasets.push(dataset);
  }
  return graph_data;
}

// creates pie graph data
model.schema.methods.createPieGraphData = function(table_data){
  var graph_data = {data: {labels: [], datasets: [{data: [], backgroundColor: []}]}, options: {responsive: true, legend: false}};

  // add colors
  var colors = palette('tol-rainbow', table_data.rows.length).map(function(hex) {
    return '#' + hex;
  });
  graph_data.data.datasets[0].backgroundColor = colors;

  // Create the graph data
  var totals = [];
  for(var i = 0, ii = table_data.rows.length; i < ii; i++){
    var dataset = {};
    // Create the graph labels
    graph_data.data.labels.push(table_data.rows[i][0]);
    var temp_row = table_data.rows[i].slice(1, table_data.rows[i].length).map(function(value){
      return Number(value.replace('$', '').replace('%', '').replace(/,/g, ''));
    });
    totals.push(temp_row.reduce(function(a, b) { return a + b; }, 0))
  }
  graph_data.data.datasets[0].data = totals;
  return graph_data;
}

// Aggregates model data
exports.getModelData = function(req, res){
    model.aggregate(model.schema.methods.createAggregate(req.params.time_frame)).exec(function(error, data) {
        if (error) {
            res.send({result:'ERROR', message: error});
        } else {
            res.json(data);
        }   
    });
}