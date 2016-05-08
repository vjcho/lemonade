var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: String,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

/*PostSchema.methods.upvote = function(cb){
	this.upvotes += 1;
	this.save(cb);
}*/


mongoose.model('Post', PostSchema);