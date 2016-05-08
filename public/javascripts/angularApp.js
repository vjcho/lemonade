var app = angular.module('dashboard', []);

app.controller('MainCtrl', ['$scope', function($scope){
	$scope.test = 'Hello World';
}])