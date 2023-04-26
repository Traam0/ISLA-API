/** @format */

const jswt = require("jsonwebtoken");
const validateAccessToken = (req, res, next) => {
  const token = req.headers.xtoken;
  if (token) {
    jswt.verify(token, process.env.jswtKey, (err, user) => {
      if (err) {
        return res.status(401).json("Invalid xToken!");
        // return res.redirect('http://localhost:5173/login')
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json("Not authenticated!");
  }
};

const authenticateAccessToken = (req, res, next) => {
  validateAccessToken(req, res, () => {
    if (req.user._id == req.params.id) {
      next();
    } else {
      res.status(403).json("Action Denied!");
    }
  });
};

const adminOnly = (req, res, next) => {
  validateAccessToken(req, res, () => {
    if (req.user._username === "admin" || req.user._id === "639092ecd4cf25121c73263f") {
      next()
    }else{
      res.status(403).json({message: 'action Denied'})
    }
  });
};

module.exports = { authenticateAccessToken, validateAccessToken, adminOnly };




//  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzkwOTJlY2Q0Y2YyNTEyMWM3MzI2M2YiLCJfdXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTY3NzU5NjkzOCwiZXhwIjoxNjgwMTg4OTM4fQ.vlbgeFw5gwWNmOQ3apEYBgKF-DkLQPFSjH5LtCjBkxM