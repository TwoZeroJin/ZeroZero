const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const coronaUrl = "http://ncov.mohw.go.kr/";
const healthInfo = "http://www.cdc.go.kr/gallery.es?mid=a20509000000&bid=0007";

router.get('/', function(req, res, next) {
    axios.get(coronaUrl).then(html => {
        axios.get(healthInfo).then(html2 => {
            /* 코로나 확진자 수 크롤링 */
            const coronaArr = [];
            let $ = cheerio.load(html.data);
            const coronaTag = $("div.liveNum ul.liveNum li");

            coronaTag.each(function(i, elem){
                let coronaObj = { 
                    _text : $(this).find("strong").text(), 
                    _num :$(this).find("span").text()
                }
                coronaArr.push(coronaObj);
            });

            console.log(coronaArr);

             /* 질병관리청 이달의 건강소식 */
             const infoArr = [];
             $ = cheerio.load(html2.data);
             const infoTag = $("div.galleryList ul li");
             infoTag.each(function(i, elem) {
                 let infoObj = {
                     _title : $(this).find("a").attr("title"),
                     _addr : $(this).find("a").attr("href")
                 }
                 infoArr.push(infoObj);
             })
             console.log(infoArr);

            res.render('healthtopic',{ infoArr : infoArr, coronaArr:coronaArr});
        });
    });
});

module.exports = router;
