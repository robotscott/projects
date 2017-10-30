var express = require('express');
var router = express.Router();
var passport = require('passport');
var Fi = require('../models/fi');

// index
router.get('/', function(req,res) {
	Fi.find({},function(err, allFis) {
		if (err) {
			console.log(err);
		} else{
			res.render('fis/', {fis: allFis});
		};
	});
});
// new
router.get('/new', function(req, res) {
	res.render('fis/new');
});
// create
router.post('/', function(req, res) {
	var newFi = req.body.fi;
	Fi.create(newFi, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else{
			res.redirect('/fis/' + newlyCreated._id);
		};
	});
});
// show
router.get('/:fi',function(req,res) {
	// find FI
	Fi.findById(req.params.fi).populate('fb_specs').exec(function(err, foundFi) {

		if (err) {
			console.log(err);
		} else{
			var data = { fi: foundFi, fb: undefined };

			// if FIRSTBranch specs are assigned to FI
			// send variables to 
			if(foundFi.fb_specs.id){
				Fb.findById(foundFi.fb_specs.id)
					.populate('header_theme')
					.populate('footer_theme')
					.populate('downstream_theme')
					.populate('cp_theme')
					.populate('obl_theme')
					.populate('homepage')
					.exec(function(err, foundFb) {
						if (err) {
							console.log(err);
						} else{
							var fb = foundFb;
						};
					});

				data = { fi: foundFi, fb: fb };
			}
			console.log(foundFi);
			res.render('fis/show', data);
		};
	})
});
// edit
router.get('/:fi/edit',function(req, res) {
	res.render('fis/edit');
});
// update
router.put('/:fi',function(req, res) {

});
// destroy
router.delete('/:fi',function(req, res) {

});

module.exports = router;