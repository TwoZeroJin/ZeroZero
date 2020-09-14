const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const Patient = require("../models/patients");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/middlewares");

//회원가입에 대한 인증 처리
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const {
    p_id,
    password,
    rePass,
    name,
    birth,
    ph_no,
    addr,
    email,
    gender,
  } = req.body;
  try {
    const exUser = await Patient.findOne({ p_id: p_id });
    if (exUser) {
      req.flash("errors", { p_id: "이미 존재하는 아이디입니다." });
      return res.redirect("/join");
      //.test함수로 해당 매개변수를 테스트! 6자 이상 영어대소문자 숫자 가능
    } else if (!/^[a-zA-Z0-9]{6,}$/.test(p_id)) {
      req.flash("errors", { p_id: "6자 이상, 숫자와 영문자만 됩니다." });
      return res.redirect("/join");
      //8자~16자 사이 영어 대소문자 숫자 가능
    } else if (!/^[a-zA-Z0-9]{8,16}$/.test(password)) {
      req.flash("errors", { password: "8-16자 사이, 숫자와 영문자만 됩니다." });
      return res.redirect("/join");
    } else if (password != rePass) {
      req.flash("errors", { rePass: "패스워드가 일치하는지 확인하세요." });
      return res.redirect("/join");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      req.flash("errors", { email: "올바른 이메일을 입력하세요." });
      return res.redirect("/join");
    }
    const hash = await bcrypt.hash(password, 12);
    await Patient.create({
      p_id,
      password: hash,
      name,
      birth,
      ph_no,
      addr,
      email,
      gender,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//아이디 중복 체크
router.post("/valid", async (req, res, next) => {
  const p_id = req.body.p_id;
  try {
    const exUser = await Patient.findOne({ p_id: p_id });
    if (exUser) {
      res.send("0");
    } else if (!/^[a-zA-Z0-9]{6,}$/.test(p_id)) {
      res.send("1");
    } else {
      res.send("2");
    }
  } catch (err) {
    next(err);
  }
});

//로그인에 대한 인증 처리, 세션 이용

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      //localStrategy에서 정의한 message 를 info로 받아오는 것 !!
      req.flash("message", info.message);
      return res.redirect("/login");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

//카카오 로그인
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
