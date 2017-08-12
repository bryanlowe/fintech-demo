var palette = require('../utils/palette.js');
var mongoose = require('mongoose');
var model = mongoose.model('SalesGrowth');

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
                'sale_statement.time_frame.year_start': 1
            }
        },
        {   
            '$group': {
                '_id': {
                    'brand': '$brand', 
                    'time_frame': '$sale_statement.time_frame.'+time_frame+'_start'
                }, 
                'units': {
                    '$sum': '$sale_statement.units'
                },
                'revenue': {
                    '$sum': '$sale_statement.revenue'
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
                    'units': '$units',
                    'revenue': '$revenue'
                },
                'time_frame': '$_id.time_frame'
            }
        },
        {   
            '$group':{
                '_id': '$time_frame',
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
        }
    ];
    return result;
}

// create table data function
model.schema.methods.createDataTable = function(model_data, options){
  var table_data = {header: [], rows: []};

  // Create the table header
  table_data.header = model_data.map(function(obj){
    return obj._id;
  });

  // Create the table data
  var data = {};
  model_data.forEach(function(sale_statement){
    sale_statement.dataset.forEach(function(data_entry){
      var result = '0.00';
      data[data_entry.brand] = data[data_entry.brand] || [];
      if(options.data_type === 'revenue'){
        result = data_entry.revenue;
      } else {
        result = data_entry.units;
      }
      data[data_entry.brand].push(result);
    });
  });

  // append the brand before the number set
  for(var key in data){
    var temp = [key];

    // find difference between entries for sales growth
    var diff = [];
    diff.push('--');
    for (var i = 1, ii = data[key].length; i < ii; i++){
        var result = ((options.data_format === 'whole') ? Number(data[key][i]) - Number(data[key][i - 1]) : ((Number(data[key][i]) - Number(data[key][i - 1])) / Number(data[key][i - 1]) * 100));
        if(isNaN(result)){
            result = '0.00';
        } else if(result.toString().match('Infinity')){
            result = result.toString().replace('Infinity','100.00');
        } else {
            result = result.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        result = (options.data_format === 'whole') ? ((options.data_type === 'revenue') ? ((result.indexOf('-') === 0) ? result.replace('-', '-$') : '$' + result) : result) : result + '%';
        diff.push(result);
    }  
    table_data['rows'].push(temp.concat(diff));
  }
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
      return Number(value.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
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
      return Number(value.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
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
      return Number(value.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
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
            // sort the model by time_frame
            data.sort(function(a, b) {
                a = new Date(a._id);
                b = new Date(b._id);
                return a - b;
            });
            result = {};
            result['table_data'] = model.schema.methods.createDataTable(data, req.params);
            result['line_graph_data'] = model.schema.methods.createLineGraphData(result['table_data']);
            result['bar_graph_data'] = model.schema.methods.createBarGraphData(result['table_data']);
            result['pie_graph_data'] = model.schema.methods.createPieGraphData(result['table_data']);
            res.json(result);
        }   
    });
}