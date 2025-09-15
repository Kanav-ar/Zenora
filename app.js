if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/Zenora";
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const morgan = require('morgan');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const mongoose = require("mongoose");
const ExpressError = require("./utils/expressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL

main()
.then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
})

store.on("error",()=>{
  console.log("ERROR IN SESSION STORE",err)
})

const sessionOptions = {
  store,
  secret:  process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

app.use(session(sessionOptions));
app.use(flash());

// Session is required to implement passport
app.use(passport.initialize());
app.use(passport.session());
// User should be authenticated using local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("viewengine","ejs");
app.set("views",path.join(__dirname,"views"))

// app.use(morgan('tiny'));
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs",ejsMate)

app.get("/",(req,res)=>{
  res.redirect("/listings");
})

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next();
})

app.use("/listings",listingRouter)
app.use("/listings",reviewRouter)
app.use("/",userRouter)

// If not matched with any route above
app.use((req, res, next) => {
  next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    // let{status = 500, message = "something went wrong!"} = err;
    // console.log(err)
    res.render("listings/error.ejs",{err})
})

app.listen(8080,(req,res)=>{
    console.log("app listening on the port 8080");
})