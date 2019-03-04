var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/.well-known/acme-challenge/XgRe0-4fJVP0QwL7rCwIdqpUA0UYBaO0yhyw3LA0N78', function(req, res, next) {
	res.send('XgRe0-4fJVP0QwL7rCwIdqpUA0UYBaO0yhyw3LA0N78.JZh9FLJvqFtkKAP1YmotKXptdBiysm2ESbfwnPsEArc');
});

module.exports = router;
