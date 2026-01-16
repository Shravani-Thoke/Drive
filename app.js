const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectToDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const cookieParser=require("cookie-parser")
const indexRoutes=require("./routes/index.routes")
const fileRoutes = require("./routes/file.routes");

const app=express()

app.set("view engine","ejs")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"));

connectToDB()


app.use("/user",userRoutes)
app.use("/",indexRoutes)
app.use("/file", fileRoutes);
PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
    
