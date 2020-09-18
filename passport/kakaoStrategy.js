const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const Patient = require('../models/patients');
// 카카오 로그인 구현
module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      // 카카오 인증이 되어있다면 로그인
      const exUser = await Patient.findOne({
          p_id:profile.id,
          password:'kakaoPassword'
      });
      if (exUser) {
        done(null, exUser);
        // 카카오 인증이 되어있지 않다면 DB에 카카오 정보 저장
      } else {
        const newUser = await Patient.create({
            p_id:profile.id,
            password:'kakaoPassword',
            // 정보 제공 동의를 하지 않을 경우 "NoName",밑에도 마찬가지
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
