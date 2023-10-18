const jwt = require ("jsonwebtoken");

const verifyUser = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    console.log('verifyUser.js error');
    return res.status(401).json({ Error: "You DEFINITELY are not authorized" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ Error: "Token is invalid or expired" });
      } else {
        req.user = decoded;  
        if (err) {
          console.error("JWT verification failed:", err.message);
          return res.status(403).json({ Error: "Token is invalid or expired" });
       }
       
        next();
      }
    });
  }
};

module.exports = verifyUser;
