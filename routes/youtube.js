const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const youtubeUrl = "http://www.youtube.com/";

router.get("/", function (req, res, next) {
  axios.get(youtubeUrl).then((html) => {
    //axios 모듈을 사용해 정보를 JSON 형태로 받아옴

    var client = require("cheerio-httpcli");
    var word = "코로나";

    var printyoutube = () =>
      client.fetch("http://www.youtube.com/search", { q: word }, function (
        err,
        $,
        res,
        body
      ) {
        console.log(res.headers);

        console.log($("title").text());

        $("a").each(function (idx) {
          console.log($(this).attr("href"));
        });
      });

    printyoutube();
  });
});

module.exports = router;
