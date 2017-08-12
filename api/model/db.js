var palette = require('../utils/palette.js');
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

// Build the Dataset models
mongoose.model('BrandShare', (new mongoose.Schema({
  brand: String,
  product: [productSchema], // array of products
  sale_statement: [saleStatementSchema] // array of sale statements
})), collection);
mongoose.model('SalesGrowth', (new mongoose.Schema({
  brand: String,
  product: [productSchema], // array of products
  sale_statement: [saleStatementSchema] // array of sale statements
})), collection);
mongoose.model('Industry', (new mongoose.Schema({
  brand: String,
  product: [productSchema], // array of products
  sale_statement: [saleStatementSchema] // array of sale statements
})), collection);
mongoose.model('Ranking', (new mongoose.Schema({
  brand: String,
  product: [productSchema], // array of products
  sale_statement: [saleStatementSchema] // array of sale statements
})), collection);
mongoose.model('Pricing', (new mongoose.Schema({
  brand: String,
  product: [productSchema], // array of products
  sale_statement: [saleStatementSchema] // array of sale statements
})), collection);