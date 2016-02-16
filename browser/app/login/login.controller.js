'use strict';

app.controller('LoginCtrl', function ($scope,LoginFactory,$state) {

	$scope.submitLogin = function(){
		LoginFactory.getLogin($scope.email,$scope.password)
		.then(function(res){
			$state.go('stories')
		})
		.then(null,function(err){
			console.log(err);
		})
	}

});