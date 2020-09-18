exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send(`<script> 
      alert('로그인이 필요합니다.')
      location.href="/login";
      </script>`)
    }
  };
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.send(`<script> 
      alert('이미 로그인 상태입니다.')
      location.href="/";
      </script>`)
    }
  };