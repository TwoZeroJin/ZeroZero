const express = require("express");
const router = express.Router();
const passport = require("passport");
const Patient = require("../models/patients");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/middlewares");

//메인화면을 렌더링하는 함수
router.get("/", (req, res, next) => {
  res.render("index");
});

//회원가입으로 들어오는 경로 처리
router.get("/join", isNotLoggedIn, (req, res, next) => {
  const errors = req.flash("errors")[0] || {};
  res.render("join", { errors: errors });
});
router.get("/login", isNotLoggedIn, (req, res, next) => {
  const message = req.flash("message");
  res.render("login", { message: message });
});
// 아이디/비번 찾기
router.get("/findId", (req, res, next) => {
  const message = "";
  res.render("findId", { message: message });
});
router.get("/findPwd", (req, res, next) => {
  const newPwd = false;
  res.render("findPwd", { newPwd: newPwd });
});

router.get("/aboutus", (req, res, next) => {
  res.render("aboutus");
});

router.get("/aboutus", (req, res, next) => {
  res.render("aboutus");
});

module.exports = router;
