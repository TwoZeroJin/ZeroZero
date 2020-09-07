const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const Patient = require('../models/patients');
const { isLoggedIn, isNotLoggedIn,parseError } = require('./middlewares/middlewares');
 
//JSON-WEB-TOKEN을 사용한 로그인 처리!
// const jwt = require('jsonwebtoken');
// const { verifyToken } = require('./middlewares/middlewares');

//회원가입에 대한 인증 처리
router.post('/join',isNotLoggedIn,async (req,res,next)=>{
    const {p_id,password,rePass,name,birth,ph_no,addr,email,gender} = req.body;
    try{
        const exUser = await Patient.findOne({p_id:p_id});
        if(exUser){
            return res.render('join',{
                message:"이미 존재하는 아이디입니다."
            });
            //.test함수로 해당 매개변수를 테스트! 6자 이상 영어대소문자 숫자 가능
        }else if(!/^[a-zA-Z0-9]{6,}$/.test(p_id)){
            return res.render('join',{
                message:"6자 이상, 숫자와 대소문자만 됩니다."
            });
            //8자~16자 사이 영어 대소문자 숫자 가능
        }else if(!/^[a-zA-Z0-9]{8,16}$/.test(password)){
            return res.render('join',{
                noPass:"8-16자,숫자와 대소문자만 됩니다."
            });
        }else if(password != rePass){
            return res.render('join',{
                equalPass:"패스워드가 일치하는지 확인하세요."
            });
        }
        const hash = await bcrypt.hash(password, 12)
        await Patient.create({
            // 이렇게 써도 됨
            // p_id: req.body.p_id,
            // password: hash,
            // name: req.body.name,
            // birth: req.body.birth,
            // ph_no: req.body.ph_no,
            // addr: req.body.addr,
            // email: req.body.email,
            // gender: req.body.gender,
            p_id,
            password :hash,
            name,
            birth,
            ph_no,
            addr,
            email,
            gender,
        });
        return res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
});

//로그인에 대한 인증 처리, 세션 이용

router.post("/login",isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local',(authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            //localStrategy에서 정의한 message 를 info로 받아오는 것 !!
            req.flash('errors',info.message);
            return res.redirect('/login');
        }
        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next);
});

//세션을 이용하지 않은 JWT 방법
// router.post("/login",isNotLoggedIn, async(req,res,next)=>{
//     try{
//         const patient = await Patient.findOne({
//             where : req.body.p_id
//         });
//         if(patient){
//             const token = jwt.sign({
//                 id: patient.p_id
//             }, process.env.JWT_SECRET,{
//                 expiresIn:'2m',
//                 issuer:"amamdoc",
//             });
//         }
//         return res.json({
//             code: 200,
//             message: '토큰이 발급되었습니다',
//             token,
//           });
//         } catch (error) {
//           console.error(error);
//           return res.status(500).json({
//             code: 500,
//             message: '서버 에러',
//           });
//     }
// });


router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;