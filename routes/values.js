var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/values', function(req, res, next) {
  res.render('values', { title: 'Enam' });
});

module.exports = router;
