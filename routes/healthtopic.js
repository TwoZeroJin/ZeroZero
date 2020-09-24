const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const coronaUrl = "http://ncov.mohw.go.kr/"; //코로나19 바이러스 관련 공식 페이지
const healthInfo = "http://www.cdc.go.kr/gallery.es?mid=a20509000000&bid=0007"; //질병관리청 페이지
//const coronaYoutube = "https://coronaboard.kr/";      //코로나 유투브 사이트


router.get("/", function (req, res, next) {
  axios.get(coronaUrl).then((html) => {
    //axios 모듈을 사용해 정보를 JSON 형태로 받아옴
    axios.get(healthInfo).then((html2) => {
      /* 코로나 확진자 수 크롤링 */
      const coronaArr = [];
      let $ = cheerio.load(html.data); //cheerio 모듈을 사용하여 필요한 정보만 가져옴
      const coronaTag = $("div.liveNum ul.liveNum li"); // 해당 페이지의 태그 위치 설정

      coronaTag.each(function (i, elem) {
        // li의 갯수만큼 반복
        let coronaObj = {
          _text: $(this).find("strong").text(), //<strong>태그의 텍스트를 가져오고
          _num: $(this).find("span.num").text(), //<span>태그의 텍스트를 가져와서
          _before: $(this).find("span.before").text(),
        };
        coronaArr.push(coronaObj); // 배열로 만듦
      });

      console.log(coronaArr);

      /* 질병관리청 이달의 건강소식 */
      const infoArr = [];
      $ = cheerio.load(html2.data);
      const infoTag = $("div.galleryList ul li");
      infoTag.each(function (i, elem) {
        let infoObj = {
          _title: $(this).find("a").attr("title"),
          _addr: $(this).find("a").attr("href"),
        };
        infoArr.push(infoObj);
      });
      console.log(infoArr);

      res.render("healthtopic", { infoArr: infoArr, coronaArr: coronaArr });
    });
  });
});

module.exports = router;
