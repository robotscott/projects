var express = require('express');
var router = express.Router({ mergeParams: true });
var passport = require('passport');
var Fi = require('../models/fi')
var Fb = require('../models/fb');

// new
router.get('/new', function(req, res) {
	Fi.findById(req.params.fi, function(err, fi) {
		if (err) {
			console.log(err);
		} else{
			res.render('fbs/new', {fi: fi});
		};
	});
	
});
// create
router.post('/', function(req, res) {
	Fi.findById(req.params.fi, function(err, fi) {
		if (err) {
			console.log(err);
		} else{			
			Fb.create(req.body.fb, function(err, newlyCreated) {
				if (err) {
					console.log(err);
				} else{
					fi.fb_specs = newlyCreated;
					res.redirect('/fis/' + req.params.fi);
				};
			})
		};
	});
});
// edit
router.get('/:fb/edit',function(req, res) {
	res.render('fbs/edit');
});
// update
router.put('/:fb',function(req, res) {

});
// destroy
router.delete('/:fb',function(req, res) {

});

module.exports = router;