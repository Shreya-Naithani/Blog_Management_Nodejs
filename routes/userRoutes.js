const express= require('express');
const user_route =express();
const userController=require('../controllers/userController');
const bodyParser=require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.set('view engine','ejs');
user_route.set('views','./views');

const session = require('express-session');0
const config =require("../config/config");

const adminLoginAuth = require("../middlewares/adminLoginAuth");

user_route.use(session({secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true

}));

user_route.use(express.static('public'));



user_route.get('/login',adminLoginAuth.is_logout,userController.loadLogin);
user_route.post('/login',userController.verifyLogin);

user_route.get('/logout',adminLoginAuth.is_login,userController.logout);

user_route.get('/profile',userController.profile);

user_route.get('/forget-password',adminLoginAuth.is_logout,userController.forgetLoad);
user_route.post('/forget-password',userController.forgetPasswordVerify);

user_route.get('/reset-password',adminLoginAuth.is_logout,userController.resetPasswordLoad);

user_route.post('/reset-password',userController.resetPassword);
module.exports = user_route;