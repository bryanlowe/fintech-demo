var mongoose = require('mongoose');
var model = mongoose.model('MarketView');

model.schema.methods.createAggregate = function(){
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
        'sale_statement.time_frame.week_end': 1,
        'sale_statement.time_frame.month_start': 1,
        'sale_statement.time_frame.month_end': 1,
        'sale_statement.time_frame.year_start': 1,
        'sale_statement.time_frame.year_end': 1,
        'sale_statement.time_frame.iso_date': 1,
        'product': 1
      }
    },
    {   
      '$group': {
        '_id': {
          'brand': '$brand', 
          'time_period': {
            'week_start': '$sale_statement.time_frame.week_start',
            'week_end': '$sale_statement.time_frame.week_end',
            'month_start': '$sale_statement.time_frame.month_start',
            'month_end': '$sale_statement.time_frame.month_end',
            'year_start': '$sale_statement.time_frame.year_start',
            'year_end': '$sale_statement.time_frame.year_end'
          },
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
          'time_period': '$_id.time_period',
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

// Aggregates model data
exports.getModelData = (req, res) => {
    model.aggregate(model.schema.methods.createAggregate()).exec((error, data) => {
        if (error) {
            res.send({result:'ERROR', message: error});
        } else {
            // sort the model by time_frame
            data.sort((a, b) => {
                a = new Date(a._id);
                b = new Date(b._id);
                return a - b;
            });
            res.json(data);
        }   
    });
}