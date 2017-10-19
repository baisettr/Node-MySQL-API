var db = require('mysql2-db');
var dbcfg = require('../config/db.json');
var async = require('async');

var models = {
    Osu: require('./osu'),
    init: (callback) => {
        if (!callback) callback = () => { };

        async.series(
            [
                (callback) => { models.Osu.init(dbcfg, models, callback); }
            ], (err) => {
                if (err) return callback(err);
                callback();
            }
        );
    },
    drop: (callback) => {
        async.series(
            [
                (callback) => { models.Osu.drop(dbcfg, models, callback); },

            ], callback
        );
    },
    shutdown: (callback) => { db.curtains(callback); }
};

module.exports = models;