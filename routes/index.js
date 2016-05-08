var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/dashboard', auth, function(req, res, next){
	res.render('dashboard', {});
});

router.post('/login', function(req, res, next){
	console.log("routerpost");
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'fill out all the fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err)
			return next(err);
		if(user){
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req, res, next);
});


module.exports = router;
