'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(session({
    // this mandatory configuration ensures that session IDs are not predictable
    secret: 'tongiscool'
}));




app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

app.use(passport.initialize());
app.use(passport.session());



// app.post('/login', function (req, res, next) {
//     User.findOne({
//         email: req.body.email,
//         password: req.body.password
//     })
//     .exec()
//     .then(function (user) {
//         if (!user) {
//             res.sendStatus(401);
//         } else {
//             req.session.userId = user._id;
//             res.json(user);
//         }
//     })
//     .then(null, next);
// });
// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/stories',
//                                    failureRedirect: '/badloginlocal'})
// );

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.send(req.user)
    // res.redirect('/users/' + req.user.username);
  });


app.get('/auth/me', function(req,res,next){
    console.log('req.session is ',req.session.passport.user)
    User.findById(req.session.passport.user)
    .then(function(user){
        console.log('i found him')
        res.json(user);
    })
    .then(null,function(err){
        console.log(err);
    })
}
);


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
  function(username, password, done) {
    User.findOne({ email: username ,password:password}, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }
      return done(null, user);
    });
  }
));



// app.post('/logout', function (req, res, next) {
//    req.session.userId = null;
//    res.send('logged out');
// });

app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/users');
});







app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

passport.use(
    new GoogleStrategy({
        clientID: '963802080065-e7s01st5cbchmrrj3oiruqvk5uq9ioj9.apps.googleusercontent.com',
        clientSecret: 'NqJQzC5Qzkt_vX09rzt0iZg2',
        callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    // google will send back the token and profile
    function (token, refreshToken, profile, done) {
        //the callback will pass back user profilie information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
        console.log('---', 'in verification callback', profile, '---');
        User.findOne({ 'google.id' : profile.id }, function (err, user) {
    // if there is an error, stop everything and return that
    // ie an error connecting to the database
    if (err) return done(err);
    // if the user is found, then log them in
    if (user) {
        return done(null, user); // user found, pass along that user
    } else {
        // if there is no user found with that google id, create them
        var newUser = new User();
        // set all of the google information in our user model
        newUser.google.id = profile.id; // set the users google id                   
        newUser.google.token = token; // we will save the token that google provides to the user                    
        newUser.google.name = profile.displayName; // look at the passport user profile to see how names are returned
        newUser.google.email = profile.emails[0].value; // google can return multiple emails so we'll take the first
        // don't forget to include the user's email, name, and photo
        newUser.email = newUser.google.email; // required field
        newUser.name = newUser.google.name; // nice to have
        newUser.photo = profile.photos[0].value; // nice to have
        // save our user to the database
        newUser.save(function (err) {
            if (err) done(err);
            // if successful, pass along the new user
            else done(null, newUser);
        });
    }
});
    })
);

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, done);
});


// handle the callback after google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/stories',
    failureRedirect : '/badlogin'
  }));



var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});



app.use(require('./error.middleware'));

module.exports = app;