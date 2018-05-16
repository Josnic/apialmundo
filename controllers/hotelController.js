var mongoose = require("mongoose");
var Hotel = require("../models/Hotel");
var response = require("../controllers/response");

var hotelController = {};

hotelController.create = function(req, res) {
    var newHotel = new Hotel(req.body);
    newHotel.save(function(err) {
        if (err) {
            response(res, 202, { message: "El Hotel no se ha creado correctamente debido a un error. ".err });
        } else {
            response(res, 201, { message: "Hotel creado correctamente." });
        }
    });

}



hotelController.readAll = function(req, res) {
    Hotel.find({}, null, { sort: { stars: 'desc' } }, function(err, hotels) {
        if (err) {
            response(res, 202, { message: "No se pudo obtener los hoteles debido a un error. ".err });
        } else {
            response(res, 200, hotels);
        }
    });
}


hotelController.readOne = function(req, res) {
    Hotel.find(req.params.id, function(err, hotels) {
        if (err) {
            response(res, 202, { message: "No se pudo obtener los hoteles debido a un error. ".err });
        } else {
            response(res, 200, hotels);
        }
    });
}




hotelController.update = function(req, res) {
    var _ = require('underscore-node');
    var obj = req.body;
    var id = obj.id;

    var objUpdate = _.omit(obj, 'id');

    Hotel.findByIdAndUpdate(4, objUpdate, function(err, hotel) {
        if (err) {
            response(res, 202, { message: "No se pudo actualizar. ".err });
        } else {
            response(res, 200, "OK", "Hotel actualizado con éxito.");
        }
    });
}


hotelController.delete = function(req, res) {
    var id = parseInt(req.body.id);
    Hotel.findByIdAndRemove(id, function(err) {
        if (err) {
            response(res, 202, { message: "No fue posible realizar la operación de eliminación. Error:  ".err });
        } else {
            response(res, 200, "Hotel eliminado correctamente.");
        }
    })
}


module.exports = hotelController;