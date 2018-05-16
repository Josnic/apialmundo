var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./config/config');
var users = mongoose.model('users', new Schema({
    name: String,
    password: String
}));

const options = {

    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
mongoose.connect(config.database, options); // connect to database
var nick = new users({
    name: 'admin',
    password: 'd033e22ae348aeb5660fc2140aec35850c4da997',
});

nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');

});