var express = require('express');
var app = express();
var router = express.Router();
var config = require('../config/config');

var cors = require('cors')
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

router.use(cors())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var hotelController = require("../controllers/hotelController.js");
var response = require("../controllers/response");
var User = require("../models/User");


router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            response(res, 401, { success: false, message: 'La autenticación falló. Usuario no encontrado.' })

        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                response(res, 401, { success: false, message: 'La autenticación falló. Password incorrecto.' })

            } else {

                // if user is found and password is right
                // create a token
                var payload = {
                    admin: req.body.name
                }
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                response(res, 200, {
                    success: true,
                    token: token
                })

            }

        }

    });
});

router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {

                return response(res, 401, { success: false, message: 'Fallo de autenticación del token.' })
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        response(res, 403, {
            success: false,
            message: 'No se recibió token.'
        })
    }

});

router.post('/create', hotelController.create);
router.get('/readAll', hotelController.readAll);
router.get('/readOne/:id', hotelController.readOne);
router.put('/update', hotelController.update);
router.delete('/delete', hotelController.delete);



module.exports = router;