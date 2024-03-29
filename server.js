var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoose = require('mongoose');
var config = require('./config/config');
var hotelRoutes = require('./routes/routes');
var response = require("./controllers/response")
const options = {

    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};
mongoose.connect(config.database, options); // connect to database
//app.set('superSecret', config.secret); // secret variable
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res) {
    res.send('Hola! El API está corriendo!');
});

app.get('/readFront', function(req, res) {

    var Hotel = require("./models/Hotel");
    var name = req.query.name;
    var stars = parseInt(req.query.stars);

    var objFilter = {}

    if (typeof name !== 'undefined' && name !== "") {
        objFilter.name = new RegExp(name);
    }

    if (stars <= 5) {
        objFilter.stars = stars;
    }

    console.log(objFilter)

    Hotel.find(objFilter, null, { sort: { stars: 'desc' } }, function(err, hotels) {
        if (err) {
            response(res, 202, { message: "No se pudo obtener los hoteles debido a un error. ".err });
        } else {
            response(res, 200, hotels);
        }
    });

});


app.use('/apiv1', hotelRoutes);

app.use(function(req, res) {
    response(res, 404, { message: "La url solicitada no se encuentra." });
});



var port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});