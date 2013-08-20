var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
// mongoose.set('debug', true);
var DB_NAME = 'icosahedron';

/* -------------- EXPORT --------------- */
var initialized = false;
var collection_name = '';

var connection;

var Point, Sector, Face;

module.exports = {
    Point: function () {
        if (!initialized) {
            throw new Error('must initialize connection');
        }
        if (!Point) {
            Point = require('./Point')(mongoose);
        }
        return Point
    },

    Face: function () {
        if (!initialized) {
            throw new Error('must initialize connection');
        }
        if (!Face) {
            Face = require('./Face')(mongoose);
        }
        return Face
    },

    Sector: function () {
        if (!initialized) {
            throw new Error('must initialize connection');
        }
        if (!Sector) {
            Sector = require('./Sector')(mongoose);
        }
        return Sector
    },

    debug: function(v){
        if (!arguments.length) v  = true;
        mongoose.set('debug', v);
    },

    init: function (db_name, cb) {
        if (!db_name) db_name = DB_NAME;
        collection_name = db_name;
        console.log('connecting with db %s', collection_name);
        mongoose.connect('mongodb://localhost/' + db_name, cb);
        initialized = true;
    },

    close: function (cb) {
        mongoose.connection.close(cb);
        initialized = false;
    },

    drop: function (cb) {
        if (!initialized) {
            throw new Error('connection not established; cannot drop');
        }

        if (!collection_name) {
            throw new Error('do not know which collection to drop');
        }

        mongoose.connection.db.dropDatabase(function (err) {
            console.log('dropped collection %s, %s ', collection_name, err);
            collection_name = '';
            mongoose.connection.close();
            initialized = false;
            cb();
        });
    }
};