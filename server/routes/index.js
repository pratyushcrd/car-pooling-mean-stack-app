var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', function(req, res, next) {
  if(req.user != undefined){
  	path = 'index1.html';
  }else{
  	path = 'login.html';
  }
  return res.sendfile(path, {root: './client'});
});

module.exports = router;
