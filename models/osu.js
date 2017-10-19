var db = require('mysql2-db');

var cfg, models;

function init(_cfg, _models, callback) {
    cfg = _cfg;
    models = _models;
}

cfg = require('../config/db.json');

function drop(_cfg, _models, callback) {
    db.stage(_cfg)
        .execute("drop table if exists osuser")
        .finale(callback);
}

function load(userId, password, callback) {
    db.stage(cfg).query("select * from osuser where ID=? and PWD=?", [userId, password]).finale(
        (err, result) => {
            callback(err, result);
        }
    );
}

function insert(userId, password, name, callback) {
    //console.log("inside 5");
    //console.log(steps);
    db.stage(cfg).execute(
        "insert into osuser(ID,PWD,NAME) values(?,?,?)",
        [userId, password, name]
    ).finale(callback => {
        //console.log(callback);
    });
}

function update(userId, password, name, callback) {
    db.stage(cfg).execute(`
            update osuser set
            PWD = ?,
            NAME = ?
                where ID = ?
            `, [password, name, userId]
    ).finale(callback);
}

module.exports = {
    init: init,
    update: update,
    load: load,
    insert: insert
};
