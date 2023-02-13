var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path")
const upload = require("./multer")
const User = require("../model/userSchema")
const passport = require("passport")
const localstryge = require("passport-local");

passport.use(User.createStrategy());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', { title: 'Express' });
});

router.get('/membership', function(req, res, next) {
  res.render('membership');
});

router.get('/Our_story', function(req, res, next) {
  res.render('Our_story', { title: 'Express' });
});

router.get('/write', function(req, res, next) {
  res.render('write', { title: 'Express' });
});

router.get('/Getstart', function(req, res, next) {
  res.render('Getstart', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  const {username,name,password,email}=req.body

  const newUser = new User ({username,name,email})

  User.register(newUser,password)
  .then(()=>{

    const authenticate = User.authenticate();
    authenticate(email,password, function(err,result){
      if(err) res.send(err)
      res.redirect('/signinpage');
    })
  })
  .catch((err)=> res.send(err))
});

router.get('/signinpage', function(req, res, next) {
  res.render('signinpage');
});

router.post('/signinpage',passport.authenticate("local",{
    successRedirect:"/mainpage",
    failureRedirect:"/signinpage"
}),function(req, res, next) {

  res.render('signinpage');
});


router.get('/mainpage', function(req, res, next) {
  res.render('mainpage', { title: 'Express' });
});

router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile', {user: req.user});
});

router.post("/profile", upload.single("avatar"), function (req, res, next) {
  const updatedUser = {
      about: req.body.about,
  };
  if (req.file) {
      if (req.body.oldavatar !== "dummy.png") {
          fs.unlinkSync(
              path.join(
                  __dirname,
                  "..",
                  "public",
                  "uploads",
                  req.body.oldavatar
              )
          );
      }

      updatedUser.avatar = req.file.filename;
  }

  User.findByIdAndUpdate(req.user._id, updatedUser)
      .then(() => {
          res.redirect("/profile");
      })
      .catch((err) => res.send(err));
});

router.get("/settings", isLoggedIn, function (req, res, next) {
  res.render("settings", { user: req.user });
});

router.post("/settings", function (req, res, next) {
  User.findByIdAndUpdate(req.user._id, req.body)
      .then(() => {
          res.redirect("/settings");
      })
      .catch((err) => res.send(err));
});

router.get('/signinbtn', function(req, res, next) {
  res.render('signinbtn', { title: 'Express' });
});

router.get("/delete", isLoggedIn, function (req, res, next) {
  User.findByIdAndDelete(req.user._id)
      .then(() => {
          res.redirect("/signup");
      })
      .catch((err) => res.send(err));
});


// --------------------------------
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}




module.exports = router;
