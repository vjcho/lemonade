var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: String,
	//time: {type: Date},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	tags: [{type: String}]
});

mongoose.model('Post', PostSchema);