'use strict';

app.factory('LoginFactory', function ($http) {

	return {
		getLogin: function(email,password){
		 	return $http.post('/login/',{
		 		email: email,
		 		password: password
		 	})
		},
		signUp: function(email,password){
			return $http.post('/api/users',{
				email: email,
		 		password: password
			})
		},
		logOut: function(){
			return $http.post('/logout/'); 
		}
	}
});