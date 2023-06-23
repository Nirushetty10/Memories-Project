const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const homePath = path.join(__dirname + "/homepage.html");
const memoriesPath = path.join(__dirname + "/memories-page.html");
const loginPath = path.join(__dirname + "/login.html");
const registerPath = path.join(__dirname + "/signup-page.html");
const noPage = path.join(__dirname + "/noRoute.html");

const authRouter = require("./routes/auth");
const memoryRouter = require("./routes/memories");
const { verifyUser } = require("./utils/verifyToken");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req,res)=>{
  res.sendFile(homePath)
})
app.get("/memories",verifyUser,  (req,res)=>{
  res.sendFile(memoriesPath)
})
app.get("/signup", (req,res)=>{
  res.sendFile(registerPath)
})
app.get("/login", (req,res)=>{
  res.sendFile(loginPath)
})

// mongoDB connection

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO);
const db = mongoose.connection;

db.once("open", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }
});

app.use("/auth", authRouter);
app.use("/memories", memoryRouter);
app.use((err,req,res,next)=>{
   const status = err.status || 500;
   const message = err.message || "Something went wrong";
   return res.status(status).send(message);
})

app.use("*", (req,res)=>{
    res.sendFile(noPage)
})

app.listen(3001, () => {
  console.log("server started on the port 3001");
});