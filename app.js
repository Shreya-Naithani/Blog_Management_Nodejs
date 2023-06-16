const mongoose =require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/BLOG_PROJECT");

const express = require('express');
const app =express();

const isBlog=require('./middlewares/isBlog');
app.use(isBlog.isBlog);
// for admin routes
const adminRoutes=require("./routes/adminRoutes");
app.use('/',adminRoutes);

// for user routes
const userRoutes=require("./routes/userRoutes");
app.use('/',userRoutes);

// for blog routes
const blogRoutes=require("./routes/blogRoutes");
app.use('/',blogRoutes);

app.listen(3000,function(){
    console.log("successfully running server");
});