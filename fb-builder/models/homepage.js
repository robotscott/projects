var mongoose = require('mongoose');

var homepageSchema = new mongoose.Schema({
	banner_theme: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb_module'
		},
		name: String
	},
	body: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Fp_row"
	}]
});

module.exports = mongoose.model('Homepage', homepageSchema);