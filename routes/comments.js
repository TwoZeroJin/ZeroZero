const express  = require('express');
const router = express.Router();
const Qna = require('../models/qna');
const Comment = require('../models/comment');
const util = require('../util');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');

//create
router.post('/',isLoggedIn, checkPostId, function(req, res){
    let post = res.locals.post;
    console.log(post);
    req.body.commenter=req.user._id;
    req.body.post = post._id; 
    
    Comment.create(req.body, function(err, comment){
        if(err){
          req.flash('commentForm', { _id: null, form:req.body });                 // 3
          req.flash('commentError', { _id: null, errors:err });  // 3
        }
    return res.redirect('/qna/'+Qna._id); //4
    });
});

module.exports = router;

// private functions
function checkPostId(req, res, next){ // 1
  Qna.findOne({_id:req.query.postId},function(err, post){
    if(err) return res.json(err);

    res.locals.post = post; // 1-1
    next();
  });
}