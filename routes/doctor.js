const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Patient = require("../models/patients");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/middlewares");

router.get('/', (req, res, next) => {
    const message = req.flash("message");
    res.render("doctor/index", {message : message});
});

// 로그인에 대한 인증 처리, 세션 이용
router.post("/login", (req, res, next) => {
    Patient.findOne({p_id : req.body.p_id}, function(err, patient) {
        console.log(patient);
        if(patient.gubun == 1) {
            return res.redirect("/doctor");
        }
        else {
            passport.authenticate("local", (authError, user, info) => {
                if (authError) {
                  console.error(authError);
                  return next(authError);
                }
                if (!user) {
                  // localStrategy에서 정의한 message 를 info로 받아오는 것 !!
                  req.flash("message", info.message);
                  return res.redirect("/doctor");
                }
                return req.login(user, (loginError) => {
                  if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                  }
                  return res.redirect("/doctor");
                });
              (req, res, next);
            });
        }
    });
});

// 화상통화
router.get("/call", isLoggedIn, function(req, res) { 
    res.render("doctor/call");
})

// 로그아웃
router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/doctor");
});

module.exports = router;