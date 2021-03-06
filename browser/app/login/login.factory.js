'use strict';

app.factory('LoginFactory', function($http) {
    var currentUser = {};
    return {

        getCurrentUser: function() {
            return $http.get('/auth/me')
                .then(function(res) {
                    // console.log('res: ', res);
                    currentUser = res.data;
                    console.log('currentUser is :',currentUser)
		            return currentUser;
                });
        },

        getLogin: function(email, password) {
            return $http.post('/login/', {
                email: email,
                password: password
            }).then(function(res) {
                // console.log("res: ", res);
                currentUser = res.data;
            });
        },
        signUp: function(email, password) {
            return $http.post('/api/users', {
                email: email,
                password: password
            }).then(function(res) {
                // console.log('res: ', res);
                currentUser = res.data;
            });
        },
        logOut: function() {
            return $http.post('/logout/');
        }
    }
});
