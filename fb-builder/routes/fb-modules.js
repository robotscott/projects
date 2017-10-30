var express = require('express');
var router = express.Router();
var passport = require('passport');
var FbModule = require('../models/fb-module');

// new
router.get('/new', function(req, res) {
	res.render('fb-modules/new');
});
// create
router.post('/', function(req, res) {

});
// edit
router.get('/:fb_module/edit',function(req, res) {
	res.render('fb-modules/edit');
});
// update
router.put('/:fb_module',function(req, res) {

});
// destroy
router.delete('/:fb_module',function(req, res) {

});

module.exports = router;