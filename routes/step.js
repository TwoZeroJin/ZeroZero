var express = require('express');
var router = express.Router();
var Step1 = require('../models/Step1');
var Step2 = require('../models/Step2');

// 기본 경로('/'), 메인 페이지에 갈 때, 로그인한 회원의 정보를 넘겨줌
router.use((req,res,next) =>{
    res.locals.user = req.user;
    next();
});

router.get('/step1', function(req, res) {
    Step1.findOne({p_id : res.locals.user}, function(err, step1) {
        res.render('question/step1', {step1: step1});            //뷰로 보내기
   });     
});

router.post('/step1', function(req, res) {             
    Step1.create(req.body, function(err, step1) {       
        if(err) return res.json(err);
        console.log('STEP 1의db저장완료');
        res.redirect('/question/step2');                   
    });
});

router.put('/step1_update', function(req, res) {
    Step1.findOneAndUpdate({p_id : res.locals.user}, req.body, function(err, step1) {
        if(err) return res.json(err);
        res.redirect('/question/step2'); 
    })
})

router.get('/step2', function(req, res) {      
    res.render('question/step2');            //뷰로 보내기
});


router.post('/step2', function(req, res) {
    Step2.create(req.body, function(err, step2) {
        console.log('STEP 2의 db저장완료');
        console.log('내용 확인 페이지 출력합니다.');
        res.redirect('/question/step3');
    });
});

router.get('/step3', function(req, res){
    Step1.findOne({p_id : res.locals.user}, function(err, step1) {
        Step2.findOne({p_id : step1.p_id}, function(err, step2) {
            res.render('question/step3', { step1 : step1, step2: step2}); 
        });
    });
});

module.exports = router;

/* Step2.findOne({p_id : req.body.p_id}, function(err, step2) {
    User.findOne({p_id : req.body.p_id}, function(err, user) {
        Step1.findOne({p_id : req.body.p_id}, function(err, step1) {
            console.log(user); */