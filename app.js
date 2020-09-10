const express = require('express');
const dotenv = require('dotenv'); 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = process.env.PORT || 5000 ;
const path = require('path');
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const passport = require('passport');
const qnaRouter = require('./routes/qna');
const commentRouter = require('./routes/comments');
const methodOverride = require('method-override');
const connect = require('./models');
const flash = require('connect-flash');
const util = require('./util');
dotenv.config();

//passport폴더 안에 정의된 함수들 임포트, 해주어야함 !!
const passportConfig = require('./passport');
passportConfig();

const app = express();
//view 엔진을 html(특히 여기에선 넌적스)으로 설정
app.set('view engine', 'ejs');
//몽구스를 이용한 몽고디비 연결
connect();


//미들 웨어 정리
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:process.env.COOKIE_SECRET,
  cookie:{
      httpOnly:true,
      secure:false,
  },
}));
app.use(methodOverride('_method'));
app.use(flash());


//로그인 인증
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) =>{
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

//라우팅
app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/qna', qnaRouter);     //게시판 이동 라우터
app.use('/comments', commentRouter);


//에러 처리
app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
  });
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(port, ()=> console.log(`Listening on port ${port}`));