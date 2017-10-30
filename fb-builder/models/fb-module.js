var mongoose = require('mongoose');

var FbModuleSchema = new mongoose.Schema({
	type: String,
	name: String,
	structure: String,
	css: String
});

module.exports = mongoose.model('Fb_module', FbModuleSchema);