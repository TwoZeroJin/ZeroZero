const express  = require('express');
const router = express.Router();
const Qna = require('../models/qna');
const util = require('../util');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');

// Index
router.get('/', async (req,res,next)=>{
  try{
    var page = Math.max(1, parseInt(req.query.page));
    page = !isNaN(page)?page:1;                        
    const limit = 10;                     

    const skip = (page-1)*limit;
    const count = await Qna.countDocuments({});
    const maxPage = Math.ceil(count/limit);
    const qna = await Qna.find()
    .sort('-createdAt')
    .populate('reg_id')
    .skip(skip)   
    .limit(limit)
    .exec();
    res.render('board', {
      qna:qna,
      currentPage:page,
      maxPage:maxPage,
      limit:limit
    });
  } catch(err){
    console.error(err);
    nexr(err);
  }
});

//new
router.get('/new',isLoggedIn, function(req, res){
  res.render('board/new');
});


//create
router.post('/',isLoggedIn, function(req, res){
      req.body.reg_id = req.user.id; // 2
      Qna.create(req.body, function(err, post){
      if(err){
        req.flash('qna', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/qna/new');
      }
      res.redirect('/qna');
    });
});
// show
router.get('/:id', async (req, res,next)=>{
  try{
    const qna = await Qna.findOne({_id:req.params.id})
      .populate('reg_id')
    console.log(qna)
    res.render('board/show', {qna});
  }catch(err){
    console.error(err);
    next(err);
  }
});

//edit
router.get('/:id/edit',isLoggedIn, async (req, res,next)=>{
  const qna = await Qna.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
  });
  res.render('board/edit', {qna});
});

// update
router.put('/:id',isLoggedIn, async (req, res,next)=>{
  req.body.updatedAt = Date.now(); //2
  const qna = await Qna.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
    if(err) return res.json(err);
  });
  res.redirect("/qna/"+req.params.id);
});

// destroy
router.delete('/:id',isLoggedIn, async (req, res, next)=>{
  const qna = await Qna.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/qna');
  });
});


module.exports=router;
