const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const passport = require("passport");
const Patient = require("../models/patients");
const Step1 = require("../models/Step1");
const Step2 = require("../models/Step2");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/middlewares");
const healthInfo = "http://www.cdc.go.kr/gallery.es?mid=a20509000000&bid=0007"; //질병관리청 페이지

//메인화면을 렌더링하는 함수
router.get("/", (req, res, next) => {
  axios.get(healthInfo).then(html2 => {
     
    /* 질병관리청 이달의 건강소식 */
     const infoArr = [];
     let $ = cheerio.load(html2.data);
     const infoTag = $("div.galleryList ul li");
     infoTag.each(function(i, elem) {
         let infoObj = {
             _title : $(this).find("a").attr("title"),
             _addr : $(this).find("a").attr("href")
         }
         infoArr.push(infoObj);
     })
    res.render('index',{ infoArr : infoArr});
  });
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

router.get('/connect', isLoggedIn ,async(req, res,next)=>{
  try{
      const step1 = await Step1.findOne({p_id:res.locals.user});
      const step2 = await Step2.findOne({p_id:step1.p_id}).sort('-write_date');
      res.render('connect',{step1:step1,step2:step2});
  }catch(err){
      next(err);
  }
});

module.exports = router;
