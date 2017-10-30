var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var middleware = require("./middleware");

var User = require('./models/user');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require("./seeds.js");

// requiring routes
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

var fiRoutes = require('./routes/fis');
var fbRoutes = require('./routes/fbs');
var fbModuleRoutes = require('./routes/fb-modules');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/fb_builder', { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    // secret: "Once again Rusty wins cutest dog!",
    secret: "Super secret FIRSTBase builder app secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB(); // seed the database

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);

// Authentication for all routes except /
// app.all('*', middleware.)

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.use('/fis', fiRoutes);
app.use('/fis/:fi/fbs', fbRoutes);
app.use('/fb-modules', fbModuleRoutes);

app.listen(3000, function() {
    console.log("FIRSTBase Builder server has started.");
});