const express = require('express');
const dotenv = require('dotenv'); 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const port = process.env.PORT || 5000 ;
const path = require('path');
const passport = require('passport');
const connect = require('./models');
const flash = require('connect-flash');

const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const logger = require('./logger');

// const sanitizeHtml = require('sanitize-html');
// const html = "<script>location.href='나중에 사용할 주소'</script>"

// Router
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const stepRouter = require('./routes/step');
const mypageRouter = require('./routes/mypage');
const qnaRouter = require('./routes/qna');
const commentRouter = require('./routes/comments');
const healthTopic = require('./routes/healthtopic');

dotenv.config();
//dotenv보다 밑에 있어야함
// const redisClient = redis.createClient({
//   url:`redis://${process.env.REDIS_HOST}:${process.env.REDIES_PORT}`,
//   password:process.env.REDIS_PASSWORD,
// });
//passport폴더 안에 정의된 함수들 require
const passportConfig = require('./passport');
passportConfig();

const app = express();
//view 엔진을 html(ejs)로 설정
app.set('view engine','ejs');
//몽고디비연결
connect();

//미들 웨어 정리
if(process.env.NODE_ENV ==='production'){
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
}else{
  app.use(morgan('dev'));
}
// app.use(morgan('dev'));
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
  // store:new RedisStore({client:redisClient}),
}));
app.use(flash());
app.use(methodOverride('_method'));

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
app.use('/question', stepRouter);
app.use('/mypage',mypageRouter);
app.use('/qna', qnaRouter);     //게시판 이동 라우터
app.use('/comments', commentRouter);
app.use('/healthtopic', healthTopic);

//에러 처리
app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.info('에러페이지에 접속되었습니다.');
    logger.error(error.message);
    next(error);
  });
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });
  
app.listen(port, ()=> console.log(`Listening on port ${port}`));