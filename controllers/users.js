const User = require("../models/user.js");

// To render SignUp form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// To add the new user data to the DataBase
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

   // login method - automatically logs in the user (serialize - sends user info to the browser)
    req.login(registeredUser, (err) => {
      if (err) {
        return next;
      }
      req.flash("success", "Welcome to Zenora!");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", "Username taken! Try something else");
    res.redirect("/signup");
  }
};

// To render Login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Handles after login
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Zenora!");

  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Logout - deserializes the user form the current session
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
