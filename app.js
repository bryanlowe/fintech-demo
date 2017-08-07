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
app.get('/brandshare/weeks', brand_share.getWeeks); // aggregates brand share by weeks
app.get('/brandshare/months', brand_share.getMonths); // aggregates brand share by months
app.get('/brandshare/years', brand_share.getYears); // aggregates brand share by years 

// sales growth routes
app.get('/salesgrowth/weeks', sales_growth.getWeeks); // aggregates sales growth by weeks
app.get('/salesgrowth/months', sales_growth.getMonths); // aggregates sales growth by months
app.get('/salesgrowth/years', sales_growth.getYears); // aggregates sales growth by years 

// industry routes
app.get('/industry/weeks', industry.getWeeks); // aggregates industry by weeks
app.get('/industry/months', industry.getMonths); // aggregates industry by months
app.get('/industry/years', industry.getYears); // aggregates industry by years 

// product trends routes
app.get('/producttrends/weeks', product_trends.getWeeks); // aggregates product trends by weeks
app.get('/producttrends/months', product_trends.getMonths); // aggregates product trends by months
app.get('/producttrends/years', product_trends.getYears); // aggregates product trends by years 

// pricing routes
app.get('/pricing/weeks', pricing.getWeeks); // aggregates pricing by weeks
app.get('/pricing/months', pricing.getMonths); // aggregates pricing by months
app.get('/pricing/years', pricing.getYears); // aggregates pricing by years 

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
