var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var params = require("./params/param");
var session = require("express-session");
const passport = require("passport");
const MongoDBStore = require('connect-mongodb-session')(session);
var methodOverride = require('method-override')
const swal = require('sweetalert2');
// var bootstrap = require("bootstrap");
// const ejsLint = require("ejs-lint");

var app = express();



/* Connecting to the database. */
mongoose.connect(
    params.DATABASECONNECTION, {
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("Connected to MongoDB");
    }
);


  
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(flash());

app.use(cookieParser());

const sessionStore = new MongoDBStore({
    uri: params.DATABASECONNECTION,
    collection: 'sessions'
})

app.use(session({
    secret: 'test12313',
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    } // 1day
}));

app.use(methodOverride('_method'))

app.use(passport.initialize());
app.use(passport.session());
// require("./setuppassport")(passport);

app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});

app.use('/asset/css', express.static(path.resolve(__dirname, "asset/css")))
app.use('/img', express.static(path.resolve(__dirname, "asset/img")))
app.use('/js', express.static(path.resolve(__dirname, "asset/js")))
app.use('/vendor', express.static(path.resolve(__dirname, "asset/vendor")))
app.use('/scss', express.static(path.resolve(__dirname, "asset/scss")))

// creating routing
app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));


/* Listening to the port 3000. */
app.listen(app.get("port"), function () {
    console.log("Server started at port " + app.get("port"));
});