const express = require('express');
const router = express.Router();
const Step1 = require('../models/Step1');
const Step2 = require('../models/Step2');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/middlewares');


router.get('/', isLoggedIn ,function(req, res){
    Step1.findOne({p_id : res.locals.user}, function(err, step1) {
        Step2.findOne({p_id : step1.p_id}, function(err, step2) {
            res.render('connect', { step1 : step1, step2: step2});     
        });
    });
});
router.get('/doctor', isLoggedIn ,function(req, res){
    res.render('doctor');
});

module.exports = router;