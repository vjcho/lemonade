var app = angular.module('dashboard', ['ui.router']);

app.factory('posts', ['$http', function($http){
	var o = {
		posts: []
	};

	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	};

	o.create = function(post) {
  		return $http.post('/posts', post).success(function(data){
    		o.posts.push(data);
  		});
	};

	o.get = function(id) {
  		return $http.get('/posts/' + id).then(function(res){
    		return res.data;
  		});
	};

	o.addComment = function(id, comment) {
  		return $http.post('/posts/' + id + '/comments', comment);
	};

	return o;
}]);

app.controller('MainCtrl', [
	'$scope', 
	'posts',
	function($scope, posts){
		$scope.posts = posts.posts;
		$scope.addPost = function(){
  			if(!$scope.title || $scope.title === '') { return; }
  			posts.create({
    			title: $scope.title,
  			});
  			$scope.title = '';
		};
	}
]);

app.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	function($scope, posts, post){
		$scope.post = post;
		$scope.addComment = function(){
  			if($scope.body === '') { return; }
  			posts.addComment(post._id, {
    			body: $scope.body,
    			author: 'user',
  			}).success(function(comment) {
    			$scope.post.comments.push(comment);
  			});
  			$scope.body = '';
		};
	}
]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){

    $stateProvider.state('dashboard', {
        	url: '/dashboard',
        	templateUrl: '/dashboard.ejs',
        	controller: 'MainCtrl'
      	})
    	.state('login',{
			url: '/',
			templateUrl: '/login.ejs',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state,auth){
				if(auth.isLoggedIn()){
					$state.go('dashboard');
				}
			}]
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.ejs',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('dashboard');
				}
			}]
		});
    $urlRouterProvider.otherwise('dashboard');
  }]);

app.controller('AuthCtrl', ['$scope','$state','auth', function($scope,$state,auth){
	//$scope.test = 'Hello World';
	$scope.user = {};

	$scope.register = function(){
		auth.register($scope.user).error(function(error){
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
			$state.go('dashboard');
		});
	};
}])

app.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};

	auth.saveToken = function(token){
		$window.localStorage['user-token'] = token;
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

	auth.logout = function(){
		$window.localStorage.removeItem('user-token');
	}


	return auth;

}]);
