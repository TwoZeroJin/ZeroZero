const express  = require('express');
const router = express.Router();
const Qna = require('../models/qna');
const Comment = require('../models/comment');
const util = require('../util');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');

//create
router.post('/',isLoggedIn, checkPostId, function(req, res){
    let post = res.locals.post;
    req.body.commenter=req.user._id;
    req.body.post = post._id; 
    
    Comment.create(req.body, function(err, comment){
        if(err){
          req.flash('commentForm', { _id: null, form:req.body });                 // 3
          req.flash('commentError', { _id: null, errors:util.parseError(err) });  // 3
        }
    return res.redirect('/qna/'+post._id); //4
    });
});

// update 
router.put('/:id', isLoggedIn, checkPermission, checkPostId, function(req, res){
  let post = res.locals.post;

  req.body.updatedAt = Date.now();
  Comment.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, comment){
    if(err){
      req.flash('commentForm', { _id: req.params.id, form:req.body });
      req.flash('commentError', { _id: req.params.id, errors:util.parseError(err) });
    }
    return res.redirect('/qna/'+post._id);
  });
});

// destroy // 3
router.delete('/:id', isLoggedIn, checkPermission, checkPostId, function(req, res){
  let post = res.locals.post;

  Comment.findOne({_id:req.params.id}, function(err, comment){
    if(err) return res.json(err);

    // save updated comment
    comment.isDeleted = true;
    comment.save(function(err, comment){
      if(err) return res.json(err);

      return res.redirect('/qna/'+post._id);
    });
  });
});

module.exports = router;

// private functions ( 댓글 입력자와 로그인 유저와 일치 하는지 확인)
function checkPermission(req, res, next){ // 1
  Comment.findOne({_id:req.params.id}, function(err, comment){
    if(err) return res.json(err);
    console.log(comment);
    if(comment.commenter != req.user.id) return redirect('/');

    next();
  });
}

// private functions ( postId 일치 여부 확인)
function checkPostId(req, res, next){ // 1
  Qna.findOne({_id:req.query.postId},function(err, post){
    if(err) return res.json(err);

    res.locals.post = post; // 1-1
    next();
  });
}