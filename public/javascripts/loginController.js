/*var app = angular.module('dashboard', ['ui.router']);

app.controller('AuthCtrl', ['$scope','$state','auth', function($scope,$state,auth){
	$scope.test = 'Hello World';
	$scope.user = {};

	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		});
	};

	$scope.login = function(){
		console.log("login");
		auth.login($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
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
		return $http.post('/dashboard', user).success(function(data){
			auth.saveToken(data.token);
		});
	};

	auth.logout = function(){
		$window.localStorage.removeItem('user-token');
	}


	return auth;
}]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
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

*/