var mongoose = require('mongoose');
var model = mongoose.model('BrandShare');

function createAggregate(time_frame){
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

// Aggregate data by weeks
exports.getWeeks = function(req, res) {
  	model.aggregate(createAggregate('week')).exec(function(error, data) {
        if (error) {
            res.send({result:'ERROR', message: error});
        } else {
            res.json(data);
        }   
    });
};

// Aggregate data by months
exports.getMonths = function(req, res) {
  	model.aggregate(createAggregate('month')).exec(function(error, data) {
        if (error) {
            res.send({result:'ERROR', message: error});
        } else {
            res.json(data);
        }   
    });
};

// Aggregate data by years
exports.getYears = function(req, res) {
  	model.aggregate(createAggregate('year')).exec(function(error, data) {
        if (error) {
            res.send({result:'ERROR', message: error});
        } else {
            res.send(data);
        }   
    });
};