var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/.well-known/acme-challenge/0cPJ-tq19nuI2W24ehuYXL44smgnKXz5jjvTlbgwM8M', function(req, res, next) {
	res.send('0cPJ-tq19nuI2W24ehuYXL44smgnKXz5jjvTlbgwM8M.DSBB3HTmC3DFge43NxShcahdRA4dpQJIhZP3AW-su0Q');
});

module.exports = router;
