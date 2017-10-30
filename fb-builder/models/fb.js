var mongoose = require('mongoose');

var fbSchema = new mongoose.Schema({
	primary_color: String,
	secondary_color: String,
	tertiary_color: String,
	base_font: String,
	secondary_font: String,
	header_theme: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb_module'
		},
		name: String
	},
	footer_theme: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb_module'
		},
		name: String
	},
	downstream_theme: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb_module'
		},
		name: String
	},
	cp_theme: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb_module'
		},
		name: String
	},
	obl_theme: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb_module'
		},
		name: String
	},
	homepage: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Homepage'
		}
	}
});

module.exports = mongoose.model('Fb', fbSchema);