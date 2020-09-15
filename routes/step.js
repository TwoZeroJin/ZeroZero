var express = require('express');
var router = express.Router();
var Step1 = require('../models/Step1');
var Step2 = require('../models/Step2');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');

router.get('/step1', isLoggedIn, function(req, res, next) {
    Step1.findOne({p_id : res.locals.user}, function(err, step1) {
        console.log(step1);
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
    });
});

router.get('/step2', isLoggedIn, function(req, res, next) {    
    res.render('question/step2');            //뷰로 보내기
});


router.post('/step2',isLoggedIn,function(req, res) {
    Step2.create(req.body, function(err, step2) {
        console.log('STEP 2의 db저장완료');
        console.log('내용 확인 페이지 출력합니다.');
        res.redirect('/question/step3');
    });
});

router.get('/step3', isLoggedIn ,async(req, res,next)=>{
    try{
        const step1 = await Step1.findOne({p_id:res.locals.user});
        const step2 = await Step2.findOne({p_id:step1.p_id}).sort('-write_date');
        res.render('question/step3',{step1:step1,step2:step2});
    }catch(err){
        next(err);
    }
});

module.exports = router;

// functions
function parseError(errors){
    var parsed = {};
    if(errors.name == 'ValidationError'){
      for(var name in errors.errors){
        var validationError = errors.errors[name];
        parsed[name] = { message:validationError.message };
      }
    } else {
      parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
  };