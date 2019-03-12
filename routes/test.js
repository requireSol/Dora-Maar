var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
    console.log("KLAPPTTT");
    res.render('test', { title: trade} );
});

module.exports = router;
