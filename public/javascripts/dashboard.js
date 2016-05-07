var app = angular.module('dashboard', []);

app.controller('MainCtrl', ['$scope', function($scope){
	$scope.posts = [];
	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') {return;}
		$scope.posts.push({title: $scope.title});
		$scope.title = '';
	};
}])