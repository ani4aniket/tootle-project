"use strict";

module.exports = function(_, passport, User) {
  const Todo = require("../models/todo");
  return {
    SetRouting: function(router) {
      router.get("/", this.indexPage);
      router.get("/signin", this.isNotLoggedIn, this.getSignIn);
      router.get("/signup", this.isNotLoggedIn, this.getSignUp);
      router.get("/home", this.isLoggedIn, this.homePage);
      router.get("/logout", this.logout);
      router.get("/addTodo", this.isLoggedIn, this.addTodoPage);
      router.get("/updateTodo/:id", this.isLoggedIn, this.updateTodoPage);
      router.get("/deleteTodo/:id", this.isLoggedIn, this.deleteTodo);

      router.post("/signin", User.LoginValidation, this.postLogin);
      router.post("/signup", User.SignUpValidation, this.postSignUp);
      router.post("/addTodo", this.isLoggedIn, this.addNewTodo);
      router.post("/updateTodo/:id", this.isLoggedIn, this.updateTodoLogic);
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
      Todo.find({}, (err, todos) => {
        res.render("home", { todos });
      });
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
    },
    addTodoPage: function(req, res) {
      return res.render("addTodo");
    },
    addNewTodo: function(req, res) {
      var todo = new Todo({
        title: req.body.title,
        description: req.body.description
      });

      todo.save().then(
        doc => {
          res.redirect("/home");
        },
        e => {
          res.status(400).send(e);
        }
      );
    },
    updateTodoPage: function(req, res) {
      var id = req.params.id;
      Todo.findOne({ _id: id }, (err, todo) => {
        res.render("updateTodo", { todo });
      });
    },

    updateTodoLogic: function(req, res) {
      var id = req.params.id;
      Todo.findOne({
        _id: id
      }).then(todo => {
        todo.title = req.body.title;
        todo.description = req.body.description;

        todo.save();
        res.redirect("/home");
      });
    },

    deleteTodo: function(req, res) {
      var id = req.params.id;
      Todo.findOneAndRemove({
        _id: id
      })
        .then(todo => {
          if (!todo) {
            return res.status(404).send();
          }
          res.redirect("/home");
        })
        .catch(e => {
          res.status(400).send();
        });
    }
  };
};
