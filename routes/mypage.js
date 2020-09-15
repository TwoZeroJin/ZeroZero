const express = require('express');
const router = express.Router();
const Patient = require('../models/patients');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');
const Patients = require('../models/patients');
const moment = require('moment');
const Step1 = require('../models/Step1');
const Step2 = require('../models/Step2');

//Date format 사용
router.get('/',isLoggedIn,async(req,res,next)=>{
  reg_date = moment(res.locals.reg_date).format("YYYY년 MM월 DD일");
  await Step1.findOne({p_id:res.locals.user})
  .then(result=>{
    res.render('mypage',{
      step1:result,
      reg_date:reg_date});
  })
  .catch(err=>{
    next(err);
  })
});

router.route('/myPharmacy')
.get((req,res,next)=>{
  res.render('myPharmacy');
})
.post(async(req,res,next)=>{
  try{
    const myPharmacy = req.body.myPharmacy;
    await Patient.findOneAndUpdate({p_id:res.locals.user.p_id},{myPharmacy:myPharmacy},{upsert:true});
    return res.send(`<script> 
        alert('변경되었습니다..ㅎ;');
        window.close();
        </script>`);
  }catch(err){
    next(err);
  }
})


//그동안 받은 진료 이력 출력하긔
router.get('/mytreat',isLoggedIn,async(req,res,next)=>{
  try{
    let page = Math.max(1, parseInt(req.query.page));
    page = !isNaN(page)?page:1;                        
    const limit = 2;                     

    const skip = (page-1)*limit;
    const count = await Step2.countDocuments({p_id:res.locals.user});
    const maxPage = Math.ceil(count/limit);
    const step2 = await Step2.find({p_id:res.locals.user})
    .sort('-write_date')
    .populate('p_id')
    .skip(skip)   
    .limit(limit)
    .exec();
    write_date = moment(step2.write_date).format("YYYY년 MM월 DD일");
    res.render('mytreat', {
      step2:step2,
      currentPage:page,
      maxPage:maxPage,
      limit:limit,
      write_date:write_date,
      count:count
    });
  } catch(err){
    console.error(err);
    nexr(err);
  }
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