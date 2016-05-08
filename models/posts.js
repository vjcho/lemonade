var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: String,
	time: {type: Date},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
	time: {type:Date},
});

mongoose.model('Post', PostSchema);