var express = require('express');
var router = express.Router();
var User = require('../models/user');


// GET for logout logout
router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          res.render('index', { title: 'Error'} );
        } else {
          if (user === null) {
            res.render('index', { title: 'Not auth'} );
          } else {
            res.render('index', { title: 'Internal'} );
          }
        }
      });
  });
module.exports = router;