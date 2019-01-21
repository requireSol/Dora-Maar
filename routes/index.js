var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userdata){
    res.render('index', { title: req.session.userdata.username, logged:true} );
  }else{
    res.render('index', { title: 'Enam Solaimani', logged :false} );
  }
});

module.exports = router;
