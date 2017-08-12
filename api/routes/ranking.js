var palette = require('../utils/palette.js');
var mongoose = require('mongoose');
var model = mongoose.model('Ranking');

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
                'product': {
                    '$filter': {
                        'input': "$product",
                        'as': "item",
                        'cond': {'$eq': ["$$item.spec_type", 'Model']}
                    }
                }
            }
        },
        {
            '$unwind': '$product'
        },
        {	
        	'$group': {
        		'_id': {
        			'brand': '$brand', 
                    'model': '$product.spec_value',
        			'time_frame': '$sale_statement.time_frame.'+time_frame+'_start'
        		}, 
    			'units': {
    				'$sum': '$sale_statement.units'
    			},
    			'revenue': {
    				'$sum': '$sale_statement.revenue'
    			}
                ,
                'last_sale_date': { 
                    '$last': "$sale_statement.time_frame.iso_date" 
                }
        	}
        },
        {
        	'$sort': {
        		'_id.brand': 1,
                '_id.model': 1
        	}
        },
        {
        	'$project': {
        		'doc': {
        			'brand': '$_id.brand',
	        		'units': '$units',
                    'model': '$_id.model',
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
                '_id': -1
            }
        }
    ];
	return result;
}

// create table data function
model.schema.methods.createDataTable = function(model_data, options){
    var table_data = {header: [], rows: []};

    // Create the table header
    table_data.header = ['Ranking', 'Brand', 'Model', 'Sales', 'Change']

    // Create the table data
    var data = {};
    var sale_statements = [];
    for(var i = 0; i < 2; i++){
        model_data[i].dataset.forEach(function(data_entry){
            var result = '0.00';
            data[data_entry.brand+':'+data_entry.model] = data[data_entry.brand+':'+data_entry.model] || [];
            if(options.data_type === 'revenue'){
                result = data_entry.revenue;
            } else {
                result = data_entry.units;
            }
            data[data_entry.brand+':'+data_entry.model].push(result);
        });
    }

    // append the brand and model before the number set
    for(var key in data){
        var result = {};
        result['brand'] = key.split(':')[0];
        result['model'] = key.split(':')[1];
        result['sales'] =  Number(data[key][0]);
        result['change'] = ((Number(data[key][0]) - Number(data[key][1])) / Number(data[key][1]) * 100);
        table_data['rows'].push(result);
    }

    // sort the model by time_frame
    table_data['rows'].sort(function(a, b) {
        return b.sales - a.sales;
    });

    // format the data with ranking
    table_data['rows'] = table_data['rows'].map(function(obj, i){
        obj['ranking'] = (i + 1);
        if(isNaN(obj['change'])){
            obj['change'] = '0.00';
        } else if(obj['change'].toString().match('Infinity')){
            obj['change'] = obj['change'].toString().replace('Infinity','100.00');
        } else {
            obj['change'] = obj['change'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            obj['sales'] = obj['sales'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        obj['change'] = (options.data_format === 'whole') ? ((options.data_type === 'revenue') ? ((obj['change'].indexOf('-') === 0) ? obj['change'].replace('-', '-$') : '$' + obj['change']) : obj['change']) : obj['change'] + '%';
        obj['sales'] = (options.data_format === 'whole') ? ((options.data_type === 'revenue') ? ((obj['sales'].toString().indexOf('-') === 0) ? obj['sales'].toString().replace('-', '-$') : '$' + obj['sales']) : obj['sales']) : obj['sales'] + '%';
        return [obj.ranking, obj.brand, obj.model, obj.sales, obj.change];
    });
    return table_data;
}

// creates line graph data
model.schema.methods.createLineGraphData = function(table_data){
  var graph_data = {data: {labels: [], datasets: []}, options: {responsive: true}};
  return graph_data;
}

// creates bar graph data
model.schema.methods.createBarGraphData = function(table_data){
  var graph_data = {data: {labels: [], datasets: []}, options: {responsive: true, scales: {yAxes: [{ticks: {beginAtZero: true}}]}}};
  return graph_data;
}

// creates pie graph data
model.schema.methods.createPieGraphData = function(table_data){
  var graph_data = {data: {labels: [], datasets: [{data: [], backgroundColor: []}]}, options: {responsive: true, legend: false}};
  return graph_data;
}

// Aggregates model data
exports.getModelData = function(req, res){
    model.aggregate(model.schema.methods.createAggregate(req.params.time_frame)).exec(function(error, data) {
        if (error) {
            res.send({result:'ERROR', message: error});
        } else {
            result = {};
            result['line_graph_data'] = model.schema.methods.createLineGraphData(result['table_data']);
            result['bar_graph_data'] = model.schema.methods.createBarGraphData(result['table_data']);
            result['pie_graph_data'] = model.schema.methods.createPieGraphData(result['table_data']);
            result['table_data'] = model.schema.methods.createDataTable(data, req.params);
            res.json(result);
        }   
    });
}