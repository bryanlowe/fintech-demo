var express = require('express'),
	wwwhisper = require('connect-wwwhisper'),
	db = require('./api/model/db'),
    routes = require('./api/routes'),
    market_view = require('./api/routes/market_view');

var app = express();

// app configurations
app.set('port', process.env.PORT || 5000);
app.use(wwwhisper());
app.use(express.static(__dirname + '/'));

// homepage
app.get('/', routes.index);

// brandshare routes
app.get('/marketview/data', market_view.getModelData); // aggregates market view data

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
