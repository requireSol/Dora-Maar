var express = require('express');
var router = express.Router();
//var User = require('../models/user');


// GET for logout logout
router.get('/profile', function (req, res, next) {
    if(req.session.userdata){
      res.render('profile', { title: req.session.userdata.username} );
    }else{
      res.send("Nicht Berechtigt");
    }
    
  });
module.exports = router;