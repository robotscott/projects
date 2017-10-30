var express = require('express');
var router = express.Router();
var passport = require('passport');
var Fi = require('../models/homepage');

// index
router.get('/', function(req,res) {

});
// new
router.get('/new', function(req, res) {
	res.render('homepages/new');
});
// create
router.post('/', function(req, res) {

});
// show
router.get('/:hp',function(req,res) {

});
// edit
router.get('/:hp/edit',function(req, res) {
	res.render('homepages/edit');
});
// update
router.put('/:hp',function(req, res) {

});
// destroy
router.delete('/:hp',function(req, res) {

});

module.exports = router;