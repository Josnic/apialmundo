var express = require('express');
var router = express.Router();
var { Validator, ValidationError } = require('express-json-validator-middleware');
var validator = new Validator({ allErrors: true });
var validate = validator.validate;
var cors = require('cors')
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

router.use(cors())
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var hotelController = require("../controllers/hotelController.js");
var response = require("../controllers/response");
var StreetSchema = {
    type: 'object',
    required: ['id', 'name', 'stars', 'price', 'image', 'amenities'],
    properties: {
        id: {
            type: 'number'
        },
        name: {
            type: 'string'
        },
        stars: {
            type: 'number'
        },
        price: {
            type: 'number'
        },
        image: {
            type: 'string'
        },
        amenities: {
            type: 'array'
        }
    }
}



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
                    admin: user.name
                }
                var token = jwt.sign(payload, app.get('superSecret'), {
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

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                // return res.json({ success: false, message: 'Fallo de autenticación del token.' });
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
                message: 'No se reibió token.'
            })
            /*
            return res.status(403).send({
                success: false,
                message: 'No se reibió token.'
            });
            */

    }

});

router.post('/create', validate({ body: StreetSchema }), hotelController.create);
router.get('/readAll', hotelController.readAll);
router.get('/readOne/:id', hotelController.readOne);
router.put('/update', validate({ body: StreetSchema }), hotelController.update);
router.delete('/delete', hotelController.delete);

module.exports = router;