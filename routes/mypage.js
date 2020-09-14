const express = require('express');
const router = express.Router();
const Patient = require('../models/patients');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');
const Patients = require('../models/patients');
const moment = require('moment');

//Date format 사용
router.get('/',isLoggedIn,(req,res,next)=>{
  reg_date = moment(res.locals.reg_date).format("YYYY-MM-DD");
    res.render('mypage',{
      reg_date:reg_date
    });
});

router.post('/:p_id/phone',isLoggedIn,async(req,res,next)=>{
  try{
    await Patient.findOneAndUpdate({p_id:req.params.p_id},{ph_no:req.body.ph_no});
    return res.send(`<script> 
        alert('변경되었습니다..ㅎ;');
        location.href="/mypage";
        </script>`);
  }catch(err){
    console.error(err);
    next(err);
  }
});
router.post('/:p_id/address',isLoggedIn,async(req,res,next)=>{
  try{
    await Patient.findOneAndUpdate({p_id:req.params.p_id},{addr:req.body.addr});
    return res.send(`<script> 
        alert('변경되었습니다..ㅎ;');
        location.href="/mypage";
        </script>`);
  }catch(err){
    console.error(err);
    next(err);
  }
});
router.post('/:p_id/email',isLoggedIn,async(req,res,next)=>{
  try{
    await Patient.findOneAndUpdate({p_id:req.params.p_id},{email:req.body.email});
    return res.send(`<script> 
        alert('변경되었습니다..ㅎ;');
        location.href="/mypage";
        </script>`);
  }catch(err){
    console.error(err);
    next(err);
  }
});
router.post('/:p_id',isLoggedIn,async(req,res,next)=>{
    try{
        const Patient = await Patients.findOne({p_id:req.params.p_id})
      .select('password');
        const result = await bcrypt.compare(req.body.password,Patient.password)
      if(result){
        await Patients.deleteOne({p_id:req.params.p_id});
        return res.send(`<script> 
        alert('탈퇴되었습니다..ㅋ');
        location.href="/";
        </script>`)
      }else{
        return res.send(`<script> 
        alert('비밀번호가 맞지 않습니다..ㅋ')
        window.history.back()
        </script>`)
      }
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;