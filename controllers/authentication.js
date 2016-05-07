var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res){
	var user = new User();

	user.username = req.body.username;
	user.email = req.body.email;

	user.setPassword(req.body.password);

	user.save(function(err){
		var token;
		token = user.generateJwt();
		res.status(200);
		res.json({
			"token": token
		});
	});
};

module.exports.login = function(req, res){
	passport.authenticate('local', function(err, user, info){
		var token;

		if(err){ //no user found
			res.status(404).json(err);
			return;
		}
		if(user){ //user found
			
		}
	})
}