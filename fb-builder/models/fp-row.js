var mongoose = require('mongoose');

var fpRowSchema = new mongoose.Schema({
	columns: Number,
	fp_theme: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Fb_module'
		},
		name: String
	}
});

module.exports = mongoose.model('Fp_row');