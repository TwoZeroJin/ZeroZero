const express = require('express');
const router = express.Router();
const Step1 = require('../models/Step1');
const Step2 = require('../models/Step2');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');


router.get('/', isLoggedIn , async(req, res, next)=>{
    try {
        const step1 = await Step1.findOne({p_id:res.locals.user});
        const step2 = await Step2.findOne({p_id:step1.p_id}).sort('-write_date');       // 작성날짜를 최신순으로 정렬해서 최신 하나를 찾기
        res.render('connect',{step1:step1,step2:step2});                 //STEP1 과 STEP2 컬렉션에서 해당 사용자의 정보를 모두 STEP3.ejs로 전송
    } catch(err) {
        next(err);
    }
});
router.get('/doctor', isLoggedIn ,function(req, res){
    res.render('doctor');
});

module.exports = router;