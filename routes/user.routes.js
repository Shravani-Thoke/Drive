const express = require("express")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const UserModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
// const connectToDB = require("../config/db")
// connectToDB()

router.get("/", (req, res) => {
    res.render("index")
})
router.get("/register", (req, res) => {
    res.render("register",{
    error: req.query.error
    })
})
router.post("/register",
    body("username").trim().isLength({ min: 3 }),
    body("email").trim().isEmail().isLength({ min: 10 }),
    body("password").trim().isLength({ min: 5 }),

    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.redirect('/user/register?error=Invalid data provided');
        }

        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hashSync(password, 8)
        const newUser = await UserModel.create({
            username,
            email,
            password:hashedPassword
        })
        const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      },
      process.env.JWT_SECRET);

    // store token in cookie
    res.cookie("token", token);
    res.redirect("/home");

})
router.get("/login",(req,res)=>{
    res.render("login", {
    error: req.query.error
  });
})
router.post("/login",
    body("email").trim().isLength({min:3}),
    body("password").trim().isLength({min:5}),
    async (req,res)=>{
        console.log("REQ BODY:", req.body);
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.redirect('/user/login?error=Invalid data provided');
        }

        const {email,password}=req.body
        const user= await UserModel.findOne({
            email: email 
        })
        if(!user){
            return res.redirect('/user/login?error=Username or password is incorrect');
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.redirect('/user/login?error=Username or password is incorrect');
        }

        const token = jwt.sign({
            id:user._id,
            username:user.username,
            email:user.email
        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.redirect("/home");

 })

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});


module.exports = router