'use strict';

app.controller('StoryDetailCtrl', function ($scope, story, users, LoginFactory) {
	$scope.currentUser = LoginFactory.getCurrentUser();
	$scope.story = story;
	$scope.users = users;
	$scope.$watch('story', function () {
		$scope.story.save();
	}, true);
});