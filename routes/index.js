const express = require('express');
const router = express.Router();
const Patient = require('../models/patients');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');
 
//api를 통해 환자 정보를 모두 가져옴
router.get('/api/patients', (req,res)=>{
    Patient.findAll()
    .then(result=>{
        res.send(result);
    })
    .catch(err =>{
        console.error(err);
    })
})
//메인화면을 렌더링하는 함수
router.get('/',async (req,res,next)=>{
    res.render('index');
});

//회원가입으로 들어오는 경로 처리
router.get('/join',isNotLoggedIn,(req,res,next)=>{
    const errors = req.flash('errors')[0] || {};
    res.render('join',{errors:errors});
})

router.get('/login',isNotLoggedIn,(req,res,next)=>{
    const message = req.flash('message');
    res.render('login',{message:message});
});
router.get('/aboutus',(req,res,next)=>{
    res.render('aboutus');
});
router.get('/healthtopic',(req,res,next)=>{
    res.render('healthtopic');
});

module.exports = router;