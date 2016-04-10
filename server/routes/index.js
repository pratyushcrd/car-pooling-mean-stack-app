var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  path = 'index.html';
  res.sendfile(path, {root: './client'});
});

module.exports = router;
