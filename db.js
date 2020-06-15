var low = require('lowdb');
var Filesync = require('lowdb/adapters/FileSync');
var adapter = new Filesync('db.json');

var db = low(adapter);

module.exports = db;