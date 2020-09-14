const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const Patient = require('../models/patients');

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      const exUser = await Patient.findOne({
          p_id:profile.id,
          password:'kakaoPassword'
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await Patient.create({
            p_id:profile.id,
            password:'kakaoPassword',
            name:profile._json.properties.nickname ? profile._json.properties.nickname : "NoName",
            birth:profile._json.kakao_account.birthday ? profile._json.kakao_account.birthday : "NoBirth",
            ph_no:'kakaoPhone',
            addr:'kakaoAddr',
            email:profile._json.kakao_account.email ? profile._json.kakao_account.email : "NoEmail@example.com",
            gender:profile._json.kakao_account.gender ? (profile._json.kakao_account.gender==="male" ? 'M' : 'F') : "No"
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
