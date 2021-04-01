const express = require('express');
const mongoose = require('mongoose')
const passport = require('passport')
const port = 3000 || process.env.Port;
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const PORT = 3000 || process.env.Port;
//database connection
const DATABASE_URI = "mongodb://localhost/taskmanagement";
mongoose.connect(DATABASE_URI, {useNewUrlParser:true,
useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", ()=>console.log("database connected"));
//passport config
require('./config/passport')(passport);

// ejs
app.set("view engine", "ejs");
app.use(expressLayouts);
// Express body parser
app.use(express.urlencoded({ extended: true }));


//session
app.use(
    session({
       secret: 'secret',
       resave: true,
       saveUninitialized: true
     })
   );
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());
//global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//routes
const user = require("./routers/user");
app.use("/", user);


app.listen(PORT, console.log("app running @" + PORT))