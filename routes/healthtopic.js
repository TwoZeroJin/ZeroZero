const express = require('express');
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const coronaUrl = "http://ncov.mohw.go.kr/";
const healthInfo = "http://www.cdc.go.kr/gallery.es?mid=a20509000000&bid=0007";

router.get('/', function(req, res, next) {
    axios.get(coronaUrl).then(html => {
        axios.get(healthInfo).then(html2 => {
            /* 질병관리청 이달의 건강소식 */
            const infoArr = [];
            let $ = cheerio.load(html2.data);
            const infoTag = $("div.galleryList ul li");
            infoTag.each(function(i, elem) {
                let infoObj = {
                    _title : $(this).find("a").attr("title"),
                    _addr : $(this).find("a").attr("href")
                }
                infoArr.push(infoObj);
            })
            console.log(infoArr);


            /* 코로나 확진자 수 크롤링 */
            const resultArr = [];
            $ = cheerio.load(html.data);
            const parentTag = $("div.liveNum ul.liveNum li");

            parentTag.each(function(i, elem){
                let itemObj = { 
                    _text : $(this).find("strong").text(), 
                    _num :$(this).find("span").text()
                }
                resultArr.push(itemObj);
            });

            console.log(resultArr);

            res.render('healthtopic',{ infoArr : infoArr, resultArr:resultArr});
        });
    });
});

module.exports = router;
