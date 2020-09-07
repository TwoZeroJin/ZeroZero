const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const Patient = require('../models/patients');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    Patient.findOne({
        _id:id
    })
    .then(user=>done(null,user))
    .catch(err => done(err));
  });

  local();
  //kakao();
};