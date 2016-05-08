var app = angular.module('dashboard', ['ui.router']);

app.controller('MainCtrl', [
	'$scope', 
	'posts',
	function($scope, posts){
	$scope.posts = posts.posts;
	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') {return;}

		posts.create({
			title: $scope.title,
			//time: new Date().getTime(),
		});

		$scope.title = '';
	};

	/*$scope.incrementUpvotes = function(post){
		posts.upvote(post);
	};*/
}])
.controller('AuthCtrl', ['$scope','$state','auth', function($scope,$state,auth){
	//$scope.test = 'Hello World';
	$scope.triggers = {
		'Drugs/Alcohol': false, 
		'Physical Abuse':false, 
		'Mental Abuse':false,
		'Depression': false,
		'Self Harm': false,
		'Rape': false,
		'Suicide':false,
		'Sexual Harassment': false,
		'Death': false
	};
	//$scope.colors = {Blue: true, Orange: true};
	$scope.user = {};

	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			console.log("error");
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		});
	};

	$scope.login = function(){
		console.log("LOGIN");
		auth.login($scope.user).error(function(error){
			console.log("error");
			$scope.error = error;
		}).then(function(){
			console.log("success login");
			$state.go('home');
		});
	};
}])
.controller('NavCtrl',[
	'$scope',
	'auth',
	function($scope, auth){
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logout = auth.logout;
			
	}]);


app.factory('posts', ['$http', 'auth', function($http, auth){
	var o = {
    posts: []
  };

  o.getAll = function(){
  	console.log("getting all");
  	return $http.get('/posts').success(function(data){
  		console.log("success");
  		angular.copy(data, o.posts);
  	});
  };

  o.create = function(post){
  	return $http.post('/posts', post, {
  		headers: {Authorization: 'Bearer '+auth.getToken()}
  	}).success(function(data){
  		o.posts.unshift(data);
  	});
  };

  /*o.upvote = function(post){
  	return $http.put('/posts/' + post._id + '/upvote', null, {
  		headers: {Authorization: 'Bearer '+auth.getToken()}
  	})
  		.success(function(data){
  			post.upvotes += 1;
  		})
  }*/

  o.get = function(id){
  	return $http.get('/posts/' + id).then(function(res){
  		return res.data;
  	}); //added semi-colon 11:52PM
  };

  o.addComment = function(id, comment){
  	return $http.post('/posts/' + id + '/comments', comment, {
  		headers: {Authorization: 'Bearer '+auth.getToken()}
  	});
  }; //added semi-colon 11:53PM

  /*o.upvoteComment = function(post, comment) {
  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
  	headers: {Authorization: 'Bearer '+auth.getToken()}
  })
    .success(function(data){
      comment.upvotes += 1;
    });
};*/

  return o;
}])
.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};

	auth.saveToken = function(token){
		console.log("savetoken");
		$window.localStorage['user-token'] = token;
		console.log("savetoken");
	};

	auth.getToken = function(){
		return $window.localStorage['user-token'];
	};

	auth.isLoggedIn = function(){
		var token = auth.getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now()/1000;
		}
		else
			return false;
	};

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};

	auth.register = function(user){
		console.log("registering");
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.login = function(user){
		console.log("login");
		return $http.post('/login', user).success(function(data){
			console.log("success");
			auth.saveToken(data.token);
		});
	};

	auth.triggers = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.triggers;
		}
	}

	auth.logout = function(){
		console.log("logout");
		$window.localStorage.removeItem('user-token');
	}


	return auth;
}])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve:{
      	postPromise: ['posts', function(posts){
      		console.log("state");
      		return posts.getAll();
      	}]
      }
    })
    .state('posts', {
    	url: '/posts/{id}',
    	templateUrl: '/posts.html',
    	controller: 'PostsCtrl',
    	resolve: {
    		post: ['$stateParams', 'posts', function($stateParams, posts){
    			return posts.get($stateParams.id);
    		}]
    	}
    })
    .state('login',{
		url: '/login',
		templateUrl: '/login.html',
		controller: 'AuthCtrl',
		onEnter: ['$state', 'auth', function($state,auth){
			if(auth.isLoggedIn()){
				$state.go('home');
			}
		}]
	})
	.state('register', {
		url: '/register',
		templateUrl: '/register.html',
		controller: 'AuthCtrl',
		onEnter: ['$state', 'auth', function($state, auth){
			if(auth.isLoggedIn()){
				$state.go('home');
			}
		}]
	});

 	$urlRouterProvider.otherwise('login');
}]);

app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post){
	$scope.post = post;

	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  // $scope.post.comments.push({
	  //   body: $scope.body,
	  //   author: 'user',
	  //   upvotes: 0
	  // });

	  posts.addComment(post._id, {
	  	body: $scope.body,
	  	author: 'user',
	  }).success(function(comment){
	  	$scope.post.comments.push(comment);
	  });
	  $scope.body = '';
	};

	/*$scope.incrementUpvotes = function(comment){
	  posts.upvoteComment(post, comment);
	};*/

}]);