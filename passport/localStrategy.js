const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Patients = require('../models/patients');
 
module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'p_id',
    passwordField: 'password',
  }, async (p_id, password, done) => {
    try {
      const Patient = await Patients.findOne({p_id:p_id})
      .select('password')
      if (Patient) {
        const result = await bcrypt.compare(password, Patient.password);
        if (result) {
          done(null, Patient);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};