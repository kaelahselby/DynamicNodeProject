var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./server/configure'),
    mongoose = require('mongoose'),
   cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
app = express();
app.set('port', process.env.PORT || 3630);
app.set('views', __dirname + '/views');
app = config(app);
mongoose.connect('mongodb://localhost/project');
mongoose.connection.on('open', function() {
console.log('Mongoose connected.');
});
app.listen(app.get('port'), function() {
		console.log('Server up: http://localhost:' + app.get('port'));
		});
