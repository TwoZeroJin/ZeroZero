var express = require('express');
var router = express.Router();
var Step1 = require('../models/Step1');
var Step2 = require('../models/Step2');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');

/* -----------------STEP 1----------------- */
/* 예진표 STEP1 - get 메소드 페이지 */
router.get('/step1', isLoggedIn, async(req, res, next)=>{
    await Step1.findOne({p_id : res.locals.user}, function(err, step1) {  // 로그인 되어있는 사용자의 정보를 'step1' 컬렉션에서 찾아
        res.render('question/step1', {step1: step1});              // 뷰로 보내기
    });
});

/* 예진표 STEP1 - (처음작성시) post 메소드 페이지 */
router.post('/step1', function(req, res) {           
    Step1.create(req.body, function(err, step1) {               // step1.ejs의 form태그에 적은 모든 내용들을 step1 컬렉션에 저장
        if(err) return res.json(err);
        console.log('STEP 1의db저장완료');
        res.redirect('/question/step2');                        // step2 라우터로 이동
    });
});

/* 예진표 STEP1 - (재작성시) post 메소드 페이지 */
router.put('/step1_update', async(req, res)=>{
    await Step1.findOneAndUpdate({p_id : res.locals.user}, req.body, function(err, step1) {       // 로그인 되어있는 사용자의 정보를 컬렉션에서 찾아 수정(업데이트)하기
        if(err) return res.json(err);
        res.redirect('/question/step2');        // step2 라우터로 이동
    });
});

/* -----------------STEP 2 ----------------- */
/* 예진표 STEP2 - get 메소드 페이지 */
router.get('/step2', isLoggedIn, function(req, res, next) {    
    res.render('question/step2');            //뷰로 보내기
});

/* 예진표 STEP2 - post 메소드 페이지 */
router.post('/step2',isLoggedIn,async(req, res)=>{
    await Step2.create(req.body, function(err, step2) {       // step2.ejs의 form태그에 적은 모든 내용들을 step2 컬렉션에 저장
        console.log('STEP 2의 db저장완료');
        res.redirect('/question/step3');
    });
});

/* -----------------STEP 3 ----------------- */
router.get('/step3', isLoggedIn ,async(req, res,next)=>{
    try {
        const step1 = await Step1.findOne({p_id:res.locals.user});
        const step2 = await Step2.findOne({p_id:step1.p_id}).sort('-write_date');       // 작성날짜를 최신순으로 정렬해서 최신 하나를 찾기
        res.render('question/step3',{step1:step1,step2:step2});                 //STEP1 과 STEP2 컬렉션에서 해당 사용자의 정보를 모두 STEP3.ejs로 전송
    } catch(err) {
        next(err);
    }
});

module.exports = router;