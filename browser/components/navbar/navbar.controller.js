'use strict';

app.controller('NavBarCtrl', function ($scope, LoginFactory,$state) {
	$scope.logOut = function(){
		LoginFactory.logOut()
		.then(function(res){
			$state.go('stories');
		})
		.then(null,function(err){
			console.log(err);
		})
	}
});