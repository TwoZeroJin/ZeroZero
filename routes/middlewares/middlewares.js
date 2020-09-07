const jwt = require('jsonwebtoken');
 
// exports.verifyToken = (req,res,next)=>{
//   try{
//       //verify 메서드로 토큰이 유효한지 확인 !
//     req.decoded = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
//     return next();
//   }catch(error){
//     if(error.name === 'TokenExpiredError'){ // 유효기간 초과
//         return res.status(419).json({
//           code:419,
//           message:'토큰이 만료되었습니다.',
//         });
//     }
//     return res.status(401).json({
//       code:401,
//       message:"유효하지 않은 토큰입니다.",
//     });
//   }
// };

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      // res.status(403).send('로그인 필요');
      res.send(`<script> 
      alert('로그인이 필요합니다.')
      window.history.back()
      </script>`)
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      // const message = encodeURIComponent('로그인한 상태입니다.');
      // res.redirect(`/?error=${message}`);
      res.send(`<script> 
      alert('이미 로그인 상태입니다.')
      window.history.back()
      </script>`)
    }
  };