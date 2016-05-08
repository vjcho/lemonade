var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', auth, function(req, res, next){
	res.render('dashboard', {});
});

router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if(err)
			return next(err);

		res.json(posts);
	});
});

router.post('/posts', auth, function(req, res, next){
	var post = new Post(req.body);
	post.author = req.payload.username;
	post.save(function(err, post){
		if(err)
			return next(err);

		res.json(post);
	});
});


router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id){
	console.log("querying");
	var query = Post.findById(id);

	query.exec(function(err, post){
		if(err)
			return next(err);
		if(!post)
			return next(new Error('cant find post'));
		req.post = post;
		return next();
	});
});


router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

/*
router.get('/register', function(req, res, next){
	res.render('register', {});
});

router.get('/login', function(req, res, next){
	res.render('login', {});
});
*/

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

router.post('/register', function(req, res, next){
	if(!req.body.username || !req.body.password){
		console.log("12385");
		return res.status(400).json({message: 'fill out all the forms'});
	}
	console.log("inside /register");
	var user = new User();
	console.log("before");
	user.username = req.body.username;
	console.log("after");
	console.log(req.body.username);
	//user.email = req.body.email;
	console.log(req.body.username);
	user.setPassword(req.body.password);

	
	user.save(function(err){
		if(err){
			console.log("ERR");
			//return res.status(400).json({message: 'asldkfj'});
			return next(err);
		}

		console.log("success");

		return res.json({token: user.generateJWT()});
	});
});



router.get('/register', function(req,res,next){
	res.render('register', {title:'Register'});
});

module.exports = router;
