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
    $stateProvider
	    .state('home', {
	        url: '/home',
	        templateUrl: '/home.html',
	        controller: 'MainCtrl',
	        resolve: {
	        	postPromise: ['posts', function(posts){
	        		return posts.getAll();
	        	}]
	        }
	    })
	    .state('posts', {
  			url: '/posts/{id}',
  			templateUrl: '/posts.html',
  			controller: 'PostsCtrl',
  			resolve: {
    			post: ['$stateParams', 'posts', function($stateParams, posts) {
      				return posts.get($stateParams.id);
    			}]
  			}
		});

    $urlRouterProvider.otherwise('home');
}]);
