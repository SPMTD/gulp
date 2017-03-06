var express = require('express');
    mongoose = require('mongoose');
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/songAPI');

var Song = require('./models/songModel');

var app = express();

var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

songRouter = require('./Routes/songRoutes')(Song);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

app.use('/api/songs', songRouter);
// app.use('/api/authors', authorRouter);
// app.use('/api/genre', genreRouter);

app.get('/', function(req, res){
    res.send('welcome to my api');
});

app.listen(port, function(){
    console.log("Gulp is running on PORT " + port)
});