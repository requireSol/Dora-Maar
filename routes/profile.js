var express = require('express');
var router = express.Router();
//var User = require('../models/user');


// GET for logout logout
router.get('/profile', function (req, res, next) {
    
            res.render('profile', { title: 'Welcome'} );
        
  });
module.exports = router;