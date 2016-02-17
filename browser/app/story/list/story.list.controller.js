'use strict';

app.controller('StoryListCtrl', function ($scope, stories, Story, users, currentUser) {
	$scope.stories = stories;
	$scope.users = users;
	$scope.currentUser = currentUser;
	console.log('the stories list controller user: ',$scope.currentUser)
	$scope.newStory = new Story();
	
	$scope.removeStory = function (story) {
		story.destroy()
		.then(function () {
			var idx = $scope.stories.indexOf(story);
			$scope.stories.splice(idx, 1);
		});
	};

	$scope.addStory = function () {
		$scope.newStory.save()
		.then(function (created) {
			created.author = $scope.newStory.author;
			$scope.newStory = new Story();
			$scope.stories.unshift(created);
		});
	};
});