var express = require('express');
var wwwhisper = require('connect-wwwhisper');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(wwwhisper());

app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
  response.render('index')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
