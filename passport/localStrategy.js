const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Patient = require('../models/patients');
 
module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'p_id',
    passwordField: 'password',
  }, async (p_id, password, done) => {
    try {
      const patient = await Patient.findOne({p_id:p_id})
      .select('password')
      if (patient) {
        const result = await bcrypt.compare(password, patient.password);
        if (result) {
          done(null, patient);
        } else {
          // messages는 passport의 authenticate 함수의 info.message로 넘겨짐
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