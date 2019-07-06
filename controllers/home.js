module.exports = function() {
  const User = require("../models/user");
  return {
    SetRouting: function(router) {
      router.post("/update/:id", this.updateProfile);
      router.post("/verify/:id", this.verifyEmail);
    },

    updateProfile: function(req, res) {
      var id = req.params.id;
      User.findOne({
        _id: id
      }).then(user => {
        user.college = req.body.college;
        user.studentid = req.body.studentid;
        user.stream = req.body.stream;
        user.dob = req.body.dob;
        user.graduationYear = req.body.graduationYear;
        user.github = req.body.github;
        user.linkedin = req.body.linkedin;
        user.about = req.body.about;

        user.save();
        res.redirect("/home");
      });
    },

    verifyEmail: function(req, res) {
      var id = req.params.id;
      User.findOne({
        _id: id
      }).then(user => {
        user.quesOne = req.body.quesOne;
        user.quesTwo = req.body.quesTwo;
        user.quesThree = req.body.quesThree;
        user.active = true;

        user.save();
        res.render("enroll");
      });
    }
  };
};
