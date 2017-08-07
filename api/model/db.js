var mongoose = require('mongoose'),
dbURI = 'mongodb://fortunestrider:R0b0Pirat3@ds117093.mlab.com:17093/heroku_f3kcglm1';

// Create the database connection
mongoose.connect(dbURI, {useMongoClient: true});

// Define connection events
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

// hardcoding the collection for demo
var collection = 'test_sample';

/* ********************************************
      DATASET SCHEMA
   ******************************************** */
var timeFrameSchema = new mongoose.Schema({
  week_start: String,
  week_end: String,
  month_start: String,
  month_end: String,
  year_start: String,
  year_end: String,
  iso_date: Date
});

var productSchema = new mongoose.Schema({
  spec_type: String,
  spec_value: String
});

var saleStatementSchema = new mongoose.Schema({
  units: Number,
  revenue: Number,
  time_frame: timeFrameSchema
});

var datasetSchema = new mongoose.Schema({
  brand: String,
  product: [productSchema], // array of products
  sale_statement: [saleStatementSchema] // array of sale statements
});

// create aggregate builder function
datasetSchema.methods.createAggregate = function(time_frame){}

// create table data function
datasetSchema.methods.createDataTable = function(model_data, options){
  var table_data = {header: [], rows: []};
  // sort the model by time_frame
  model_data.sort(function(a, b) {
    a = new Date(a._id);
    b = new Date(b._id);
    return a - b;
  });

  // Create the table header
  table_data['header'] = model_data.map(function(obj){
    return obj._id;
  });

  // Create the table data
  var data = {};
  model_data.forEach(function(sale_statement){
    sale_statement.dataset.forEach(function(data_entry){
      var result = '0.00';
      data[data_entry.brand] = data[data_entry.brand] || [];
      if(options.data_type === 'revenue'){
        result = ((options.data_format === 'whole') ? data_entry.revenue : (data_entry.revenue / sale_statement.revenue_total * 100)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if(options.data_format === 'whole'){ result = '$' + result; }
      } else {
        result = ((options.data_format === 'whole') ? data_entry.units : (data_entry.units / sale_statement.unit_total * 100)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;    
      }
      if(options.data_format !== 'whole'){ result += '%'; }
      data[data_entry.brand].push(result);
    });
  });

  // apppend the brand before the number set
  for(var key in data){
    var temp = [key];
    table_data['rows'].push(temp.concat(data[key]));
  }
  return table_data;
}

// Build the Dataset models
mongoose.model('Dataset', datasetSchema, collection);
mongoose.model('SalesGrowth', datasetSchema, collection);
mongoose.model('Industry', datasetSchema, collection);
mongoose.model('ProductTrends', datasetSchema, collection);
mongoose.model('Pricing', datasetSchema, collection);