var app = angular.module('login', []);

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
		auth.login($scope.user).error(function(error){
			$scope.error = error;
		}).then(function(){
			$state.go('home');
		});
	};

	
}])