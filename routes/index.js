const express = require('express');
const router = express.Router();
const Patient = require('../models/patients');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');
 
// 기본 경로('/'), 메인 페이지에 갈 때, 로그인한 회원의 정보를 넘겨줌
router.use((req,res,next) =>{
    res.locals.user = req.user;
    next();
});
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
router.get('/join',isNotLoggedIn,async (req,res,next)=>{
    res.render('join')
})

router.get('/login',isNotLoggedIn, async(req,res,next)=>{
    res.render('login');
});

router.get('/mypage',isLoggedIn,(req,res,next)=>{
    res.send("아무것도 없음");
})

module.exports = router;