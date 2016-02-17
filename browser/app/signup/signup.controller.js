'use strict';

app.controller('SignUpCtrl', function($scope, LoginFactory, $state) {
		$scope.currentUser = LoginFactory.getCurrentUser();
    $scope.submitSignup = function() {
        LoginFactory.signUp($scope.email, $scope.password)
            .then(function(res) {
                $state.go('stories')
            })
            .then(null, function(err) {
                console.log(err);
            })
    }

});
