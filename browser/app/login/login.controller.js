'use strict';

app.controller('LoginCtrl', function ($scope,LoginFactory,$state) {
	$scope.currentUser = LoginFactory.getCurrentUser();
	console.log('controller current user: ',$scope.currentUser)
	$scope.submitLogin = function(){
		LoginFactory.getLogin($scope.email,$scope.password)
		.then(function(res){
			$state.go('stories');
		})
		.then(null,function(err){
			console.log(err);
		})
	}

});