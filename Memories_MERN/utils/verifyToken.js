const jwt = require("jsonwebtoken");
const createError  = require("../utils/error.js");
// const path = require("path");
// const loginPath = path.join(__dirname + "/login.html");

const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token) return res.redirect("http://localhost:3001/login")

    jwt.verify(token, process.env.JWT_SECRETE, (err,user)=>{
        if(err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        next();
    })
}

const verifyUser = (req,res,next)=>{
    debugger;
    verifyToken(req,res,next, ()=>{
        if(req.user.id == req.params.id || req.user.isAdmin) {
            next();
        } else {
           res.redirect("http://localhost:3001/login")
        }
    })
}

const verifyAdmin = (req,res,next)=>{
    verifyToken(req,res,next, ()=>{
        if(req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    })
}

module.exports = { verifyToken , verifyUser, verifyAdmin};