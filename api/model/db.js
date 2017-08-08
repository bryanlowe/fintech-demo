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

// create aggregate builder function
datasetSchema.methods.createAggregate = function(time_frame){}

// create table data function
datasetSchema.methods.createDataTable = function(model_data, options){
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
        result = ((options.data_format === 'whole') ? data_entry.revenue : (data_entry.revenue / sale_statement.revenue_total * 100)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if(options.data_format === 'whole'){ result = '$' + result; }
      } else {
        result = ((options.data_format === 'whole') ? data_entry.units : (data_entry.units / sale_statement.unit_total * 100)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;    
      }
      if(options.data_format !== 'whole'){ result += '%'; }
      data[data_entry.brand].push(result);
    });
  });

  // append the brand before the number set
  for(var key in data){
    var temp = [key];
    table_data['rows'].push(temp.concat(data[key]));
  }
  return table_data;
}

// creates line graph data
datasetSchema.methods.createLineGraphData = function(table_data){
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
datasetSchema.methods.createBarGraphData = function(table_data){
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
datasetSchema.methods.createPieGraphData = function(table_data){
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

// Build the Dataset models
mongoose.model('Dataset', datasetSchema, collection);
mongoose.model('SalesGrowth', datasetSchema, collection);
mongoose.model('Industry', datasetSchema, collection);
mongoose.model('ProductTrends', datasetSchema, collection);
mongoose.model('Pricing', datasetSchema, collection);