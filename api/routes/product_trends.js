var palette = require('../utils/palette.js');
var mongoose = require('mongoose');
var model = mongoose.model('Dataset');

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

// Aggregates model data
exports.getModelData = function(req, res){
    model.aggregate(model.schema.methods.createAggregate(req.params.time_frame)).exec(function(error, data) {
        if (error) {
            res.send({result:'ERROR', message: error});
        } else {
            result = {};
            result['table_data'] = model.schema.methods.createDataTable(data, req.params);
            res.json(result);
        }   
    });
}