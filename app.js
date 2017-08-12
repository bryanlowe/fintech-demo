var express = require('express'),
	wwwhisper = require('connect-wwwhisper'),
	db = require('./api/model/db'),
    routes = require('./api/routes'),
    brand_share = require('./api/routes/brand_share'),
    sales_growth = require('./api/routes/sales_growth'),
    industry = require('./api/routes/industry'),
    product_trends = require('./api/routes/product_trends'),
    pricing = require('./api/routes/pricing');

var app = express();

// app configurations
app.set('port', process.env.PORT || 5000);
app.use(wwwhisper());
app.use(express.static(__dirname + '/'));

// homepage
app.get('/', routes.index);

// brandshare routes
app.get('/brandshare/:time_frame/:data_type/:data_format/:brand?', brand_share.getModelData); // aggregates brand share data

// sales growth routes
app.get('/salesgrowth/:time_frame/:data_type/:data_format/:brand?', sales_growth.getModelData); // aggregates sales growth data

// industry routes
app.get('/industry/:time_frame/:data_type/:data_format/:brand', industry.getModelData); // aggregates industry data

// product trends routes
app.get('/producttrends/:time_frame/:data_type/:data_format/:brand?', product_trends.getModelData); // aggregates product trends data

// pricing routes
app.get('/pricing/:time_frame/:data_type/:data_format/:brand?', pricing.getModelData); // aggregates pricing data

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
