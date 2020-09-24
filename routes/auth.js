const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const Patient = require("../models/patients");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares/middlewares");

// 회원가입에 대한 인증 처리
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const {
    p_id,
    password,
    rePass,
    name,
    birth,
    ph_no,
    addr,
    email,
    gender,
  } = req.body;
  try {
    // BackEnd 유효성 검사
    const exUser = await Patient.findOne({ p_id: p_id });
    if (exUser) {
      req.flash("errors", { p_id: "이미 존재하는 아이디입니다." });
      return res.redirect("/join");
      //.test함수로 해당 매개변수를 테스트! 6자 이상 영어대소문자 숫자 가능
    } else if (!/^[a-zA-Z0-9]{6,}$/.test(p_id)) {
      req.flash("errors", { p_id: "6자 이상, 숫자와 영문자만 됩니다." });
      return res.redirect("/join");
      //8자~16자 사이 영어 대소문자 숫자 가능
    } else if (!/^[a-zA-Z0-9]{8,16}$/.test(password)) {
      req.flash("errors", { password: "8-16자 사이, 숫자와 영문자만 됩니다." });
      return res.redirect("/join");
    } else if (password != rePass) {
      req.flash("errors", { rePass: "패스워드가 일치하는지 확인하세요." });
      return res.redirect("/join");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      req.flash("errors", { email: "올바른 이메일을 입력하세요." });
      return res.redirect("/join");
    }
    // 검증이 끝나면 DB에 입력받은 데이터 값 추가
    const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화, password의 값을 12번 암호화 작업
    await Patient.create({
      p_id,
      password: hash,
      name,
      birth,
      ph_no,
      addr,
      email,
      gender,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// 아이디 중복 체크
router.post("/valid", async (req, res, next) => {
  const p_id = req.body.p_id;
  try {
    // if문에 따라 send함수로 값을 보내주고 그 값에 따라 결과를 validate.js에서 출력
    const exUser = await Patient.findOne({ p_id: p_id });
    if (exUser) {
      res.send("0");
    } else if (!/^[a-zA-Z0-9]{6,}$/.test(p_id)) {
      res.send("1");
    } else {
      res.send("2");
    }
  } catch (err) {
    next(err);
  }
});
// 로그인에 대한 인증 처리, 세션 이용
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      // localStrategy에서 정의한 message 를 info로 받아오는 것 !!
      req.flash("message", info.message);
      return res.redirect("/login");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      if (user.gubun === 2) {
        return res.redirect("/doctor");
      }
      return res.redirect("/");
    });
  })(req, res, next);
});
// 잊어버린 아이디/비번 찾기
router.post("/findId", async (req, res, next) => {
  const { name, ph_no } = req.body;
  try {
    const patient = await Patient.findOne({ name: name, ph_no: ph_no }).select(
      "p_id"
    );
    if (patient) {
      let findId = patient.p_id;
      let message = `찾으시는 아이디는 \'${findId}\' 입니다.`;
      return res.render("logjoin/findId", { message: message });
    } else {
      return res.send(`<script>
            alert('일치하는 회원이 없습니다.');
            location.href="/findId";
            </script>`);
    }
  } catch (err) {
    next(err);
  }
});
router.post("/findPwd", async (req, res, next) => {
  const { p_id, ph_no } = req.body;
  try {
    const patient = await Patient.findOne({ p_id: p_id, ph_no: ph_no });
    if (patient) {
      return res.render("logjoin/newPwd", { p_id: patient.p_id });
    } else {
      return res.send(`<script>
            alert('일치하는 회원이 없습니다.');
            location.href="/findPwd";
            </script>`);
    }
  } catch (err) {
    next(err);
  }
});
// 비밀번호 변경
router.post("/newPwd", async (req, res, next) => {
  const { password, rePass, p_id } = req.body;
  try {
    if (!/^[a-zA-Z0-9]{8,16}$/.test(password)) {
      return res.send(`<script>
            alert('8-16자 사이 숫자와 영문자로 부탁드립니다.');
            window.history.back();
            </script>`);
    } else if (password != rePass) {
      return res.send(`<script>
            alert('비밀번호를 확인해 주세요.');
            window.history.back();
            </script>`);
    } else {
      const newPwd = await bcrypt.hash(password, 12);
      await Patient.findOneAndUpdate({ p_id: p_id }, { password: newPwd });
      return res.send(`<script>
            alert('비밀번호가 변경되었습니다.');
            window.close();
            </script>`);
    }
  } catch (err) {
    next(err);
  }
});
// 로그아웃
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});
// 카카오 로그인
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
