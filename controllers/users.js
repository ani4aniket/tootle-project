"use strict";

module.exports = function(_, passport, User) {
  return {
    SetRouting: function(router) {
      router.get("/", this.indexPage);
      router.get("/signin", this.isNotLoggedIn, this.getSignIn);
      router.get("/signup", this.isNotLoggedIn, this.getSignUp);
      router.get("/home", this.isLoggedIn, this.homePage);
      router.get("/logout", this.logout);

      router.post("/signin", User.LoginValidation, this.postLogin);
      router.post("/signup", User.SignUpValidation, this.postSignUp);
    },

    indexPage: function(req, res) {
      return res.render("index");
    },

    getSignIn: function(req, res) {
      const errors = req.flash("error");
      return res.render("signin", {
        title: "Tootle  | Project",
        messages: errors,
        hasErrors: errors.length > 0
      });
    },

    postLogin: passport.authenticate("local.login", {
      successRedirect: "/home",
      failureRedirect: "/signin",
      failureFlash: true
    }),

    getSignUp: function(req, res) {
      const errors = req.flash("error");
      return res.render("signup", {
        title: "Tootle | SignUp",
        messages: errors,
        hasErrors: errors.length > 0
      });
    },

    postSignUp: passport.authenticate("local.signup", {
      successRedirect: "/home",
      failureRedirect: "/signup",
      failureFlash: true
    }),

    homePage: function(req, res) {
      return res.render("home");
    },

    logout: function(req, res) {
      req.logout();
      res.redirect("/");
    },

    isLoggedIn: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect("/signin");
    },

    isNotLoggedIn: function(req, res, next) {
      if (req.isAuthenticated()) {
        return res.redirect("/home");
      }
      return next();
    }
  };
};
