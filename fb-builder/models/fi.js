var mongoose = require('mongoose');

var fiSchema = new mongoose.Schema({
	name: String,
	location: String,
	type: String,
	fb_specs: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb'
		}
	}
});

module.exports = mongoose.model('Fi', fiSchema);