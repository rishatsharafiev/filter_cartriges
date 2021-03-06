var express = require('express');
var router = express.Router();
var fs = require('fs');

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  readJSONFile('views/data.json', function (err, json) {
    if(err) { throw err; }
    res.json(json);
  });
});

module.exports = router;
