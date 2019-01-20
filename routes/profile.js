var express = require('express');
var router = express.Router();
//var User = require('../models/user');


// GET for logout logout
router.get('/profile', function (req, res, next) {
    if(req.session.page_views){
      req.session.page_views++;
      res.render('profile', { title: req.session.page_views} );
   } else {
      req.session.page_views = 1;
     res.render('profile', { title: "Welcome"} );
   }
            
        
  });
module.exports = router;