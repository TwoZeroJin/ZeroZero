const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Patient = require("../models/patients");
const Step1 = require("../models/Step1");
const Step2 = require("../models/Step2");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/middlewares");

router.get('/', (req, res, next) => {
    const message = req.flash("message");
    res.render("doctor/index", {message : message});
});

// 로그인에 대한 인증 처리, 세션 이용
router.post("/login", async(req, res, next) => {
          passport.authenticate("local", (authError, user, info) => {
            if (authError) {
              console.error(authError);
              return next(authError);
            }
            if (!user) {
              // localStrategy에서 정의한 message 를 info로 받아오는 것 !!
              req.flash("message", info.message);
              return res.redirect("/login");
            }
            if(user.gubun === 1) { // user의 gubun 값을 가져오기 위해서 passport/LocalStrategy 14번 줄에 gubun 추가
              return res.send(`<script>
              alert('의사 전용페이지입니다.');
              location.href='/doctor';
              </script>`);
            }
            return req.login(user, (loginError) => {
              if (loginError) {
                console.error(loginError);
                return next(loginError);
              }
              return res.redirect("/doctor");
            });
          })(req, res, next);
        });

// 화상통화
router.route('/call')
.get(isLoggedIn,(req, res)=>{
      const step2 = null;
      return res.render("doctor/call",{step2:step2});
})
.post(isLoggedIn,async(req,res,next)=>{
  try{
    const {p_id} = req.body;
    const patient = await Patient.findOne({p_id:p_id});
    const step2 = await Step2.findOne({p_id:patient._id}).sort('-write_date'); 
    return res.render("doctor/call",{step2:step2});
  }catch(err){
    next(err);
  }
});

router.post("/description",async(req,res,next)=>{
  const {_id,Dname,description} = req.body;
  await Step2.findOneAndUpdate({_id:_id},{
    Dname:Dname,
    description:description
  },{upsert:true});
  return res.send(`<script>
  alert('진료가 완료되었습니다.');
  location.href="/doctor";
  </script>`);
});
// 로그아웃
router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/doctor");
});

module.exports = router;