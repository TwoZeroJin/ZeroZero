const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const port = process.env.PORT || 5000;
const path = require("path");
const passport = require("passport");
const connect = require("./models");
const flash = require("connect-flash");

const hpp = require("hpp");
const logger = require("./logger");

// const sanitizeHtml = require('sanitize-html');
// const html = "<script>TEST</script>";

// Router
const indexRouter = require("./routes");
const authRouter = require("./routes/auth");
const stepRouter = require("./routes/step");
const mypageRouter = require("./routes/mypage");
const qnaRouter = require("./routes/qna");
const commentRouter = require("./routes/comments");
const connectRouter = require("./routes/connect");
const healthTopic = require("./routes/healthtopic");
const doctorRouter = require("./routes/doctor");
dotenv.config();

//dotenv보다 밑에 있어야함
//passport폴더 안에 정의된 함수들 require
const passportConfig = require("./passport");
passportConfig();

const app = express();
//http 서버 생성(추가본)
const server = require("http").createServer(app);
const io = require("socket.io")(server);

//view 엔진을 html(ejs)로 설정
app.set("view engine", "ejs");
//몽고디비연결
connect();

//미들 웨어 정리
if (process.env.NODE_ENV === "production") {
  // Heroku 사용시, NODE_ENV가 production으로 바뀜
  app.use(morgan("combined"));
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}
// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
};
if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
app.use(flash());
app.use(methodOverride("_method"));

//로그인 인증
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

//라우팅
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/question", stepRouter);
app.use("/mypage", mypageRouter);
app.use("/qna", qnaRouter); //게시판 이동 라우터
app.use("/comments", commentRouter);
app.use("/connect", connectRouter);
app.use("/healthtopic", healthTopic);
app.use("/doctor", doctorRouter);

io.on("connection", (socket) => {
  socket.on("join", (roomId) => {
    const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 };
    const numberOfClients = roomClients.length;

    if (numberOfClients == 0) {
      console.log(
        `Creating room ${roomId} and emitting room_created socket event`
      );
      socket.join(roomId);
      socket.emit("room_created", roomId);
    } else if (numberOfClients == 1) {
      console.log(
        `Joining room ${roomId} and emitting room_joined socket event`
      );
      socket.join(roomId);
      socket.emit("room_joined", roomId);
    } else {
      console.log(`Can't join room ${roomId}, emitting full_room socket event`);
      socket.emit("full_room", roomId);
    }
  });

  socket.on("start_call", (roomId) => {
    console.log(`Broadcasting start_call event to peers in room ${roomId}`);
    socket.broadcast.to(roomId).emit("start_call");
  });
  socket.on("webrtc_offer", (event) => {
    console.log(
      `Broadcasting webrtc_offer event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_offer", event.sdp);
  });
  socket.on("webrtc_answer", (event) => {
    console.log(
      `Broadcasting webrtc_answer event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_answer", event.sdp);
  });
  socket.on("webrtc_ice_candidate", (event) => {
    console.log(
      `Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`
    );
    socket.broadcast.to(event.roomId).emit("webrtc_ice_candidate", event);
  });
});

//에러 처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

server.listen(port, () => console.log(`Listening on port ${port}`));
