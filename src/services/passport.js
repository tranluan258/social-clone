const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const accountModel = require("../models/accounts");
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  accountModel.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      // callbackURL: "https://new-social-clone.herokuapp.com/auth/google/callback",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      accountModel.findOne({ id: profile.id }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new accountModel({
            id: profile.id,
            name: profile._json.name,
            email: profile._json.email,
            img: profile._json.picture,
            type: "0",
          })
            .save()
            .then((user) => done(null, user));
        }
      });
    },
  ),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (username, password, done) {
      if (!emailValidator.validate(username)) {
        return done(null, false, { message: "Incorrect email format" });
      }
      accountModel.findOne({ email: username }, function (err, user) {
        if (err) {
          return done(null, false, {
            message: "Please enter email and password",
          });
        }
        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        return done(null, user);
      });
    },
  ),
);
