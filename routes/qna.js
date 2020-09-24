const express = require("express");
const router = express.Router();
const Qna = require("../models/qna");
const util = require("../util");
const Comment = require("../models/comment");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/middlewares");

// Index
router.get("/", async (req, res, next) => {
  try {
    var page = Math.max(1, parseInt(req.query.page));
    page = !isNaN(page) ? page : 1;
    const limit = 10;

    const skip = (page - 1) * limit;
    const count = await Qna.countDocuments({});
    const maxPage = Math.ceil(count / limit);

    const qna = await Qna.aggregate([
      {
        $lookup: {
          from: "patients",
          localField: "reg_id",
          foreignField: "_id",
          as: "reg_id",
        },
      },
      { $unwind: "$reg_id" },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $project: {
          title: 1,
          reg_id: {
            p_id: 1,
          },
          views: 1,
          numId: 1,
          createdAt: 1,
          commentCount: { $size: "$comments" },
        },
      },
    ]).exec();
    res.render("board", {
      qna: qna,
      currentPage: page,
      maxPage: maxPage,
      limit: limit,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//new
router.get("/new", isLoggedIn, function (req, res) {
  res.render("board/new");
});

//create
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    req.body.reg_id = req.user.id;
    const qna = await Qna.create({
      title: req.body.title,
      content: req.body.content,
      reg_id: req.body.reg_id,
      views: 1,
      numId: 1,
    });
    console.log(qna);
    res.redirect("/qna");
  } catch (err) {
    console.error(err);
    next(err);
  }
});
// show
router.get("/:id", function (req, res) {
  let commentForm = req.flash("commentForm")[0] || { _id: null, form: {} };
  let commentError = req.flash("commentError")[0] || {
    _id: null,
    parentComment: null,
    errors: {},
  };

  Promise.all([
    Qna.findOne({ _id: req.params.id }).populate({
      path: "reg_id",
      select: "p_id",
      commentCount: { $size: "$comments" },
    }),
    Comment.find({ post: req.params.id })
      .sort("createdAt")
      .populate({ path: "commenter", select: "p_id" }),
  ])
    .then(([qna, comments]) => {
      qna.views++;
      qna.save();
      res.render("board/show", {
        qna: qna,
        comments: comments,
        commentForm: commentForm,
        commentError: commentError,
      });
    })
    .catch((err) => {
      console.log("err: ", err);
      return res.json(err);
    });
});

//edit
router.get("/:id/edit", isLoggedIn, async (req, res, next) => {
  const qna = await Qna.findOne({ _id: req.params.id }, function (err, post) {
    if (err) return res.json(err);
  });
  res.render("board/edit", { qna });
});

// update
router.put("/:id", isLoggedIn, async (req, res, next) => {
  req.body.updatedAt = Date.now(); //2
  const qna = await Qna.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    function (err, post) {
      if (err) return res.json(err);
    }
  );
  res.redirect("/qna/" + req.params.id);
});

// destroyc
router.delete("/:id", isLoggedIn, async (req, res, next) => {
  const qna = await Qna.deleteOne({ _id: req.params.id }, function (err) {
    if (err) return res.json(err);
    res.redirect("/qna");
  });
});

module.exports = router;
