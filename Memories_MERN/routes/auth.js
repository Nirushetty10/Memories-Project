const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError  = require("../utils/error.js");
const { verifyToken, verifyUser } = require("../utils/verifyToken.js");
require('dotenv').config();

//  Register
router.post("/register", async (req, res, next) => {
  const { username, email} = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password , salt);
    const user = await new User({
      username,
      email,
        password : hashedPassword
      });
      await user.save();
      res.status(202).send("user successfully registered")
  } catch(err) {
    next(createError(500, "user name/email already taken"))
    // res.status(500).send("user name/email already taken");
  }
});

// Login
router.post("/login", async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      if(await bcrypt.compare(req.body.password , user.password)) {
        const token = jwt.sign({
          id: user._id,
          isAdmin : user.isAdmin
        }, process.env.JWT_SECRETE, {expiresIn: '1d'})
        res.cookie("access_token",token, {
          httpOnly : true
        }).status(200).send("Successfull");
      } else {
        next(createError(500, "Invalid email or password !.."))
        // res.status(500).send();
      }
    } else {
      next(createError(500, "user not found"))
      // res.status(500).send("user not found");
    }
  });

  // check jwt token and user
  router.get("/token", verifyToken , (req,res,next)=>{
    res.send(req.user);
  })
  router.get("/checkuser/:id", verifyUser , (req,res,next)=>{
    res.send("Hello welcome");
  })

  // get user ID
  router.get("/userid", verifyUser , (req,res,next)=>{
    res.status(200).json(req.user.id);
  })

  // logout
  router.get('/logout', (req, res) => {
    const expiredToken = jwt.sign({}, process.env.JWT_SECRETE, { expiresIn: 0 });
    res.cookie("access_token", expiredToken, {
      httpOnly: true,
      expires: new Date(0)
    });
    res.status(200).send('Logged out successfully');
  });

module.exports = router;