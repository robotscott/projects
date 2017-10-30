var express = require('express');
var router = express.Router();
var passport = require('passport');
var Fb = require('../models/fp-row');

// new
router.get('/new', function(req, res) {
	res.render('fp-rows/new');
});
// create
router.post('/', function(req, res) {

});
// edit
router.get('/:row/edit',function(req, res) {
	res.render('fp-rows/edit');
});
// update
router.put('/:row',function(req, res) {

});
// destroy
router.delete('/:row',function(req, res) {

});

module.exports = router;