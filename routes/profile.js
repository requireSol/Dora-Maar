var express = require('express');
var router = express.Router();
//var User = require('../models/user');


// GET for logout logout
router.get('/profile', function (req, res, next) {
  var hour = 3600000
req.session.cookie.expires = new Date(Date.now() + hour)
req.session.cookie.maxAge = hour
    if(req.session.userdata){
      res.render('profile', { title: req.session.userdata.username} );
    }else{
      res.send("Nicht Berechtigt");
    }
    
  });
module.exports = router;