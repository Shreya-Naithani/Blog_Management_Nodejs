const express= require('express');
const admin_route =express();
const adminController=require('../controllers/adminController');
const bodyParser=require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views');

const session = require('express-session');0
const config =require("../config/config");

const adminLoginAuth = require("../middlewares/adminLoginAuth");

admin_route.use(session({
     secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true

}));

const multer = require('multer');
const path = require('path');
admin_route.use(express.static('public'));

const storage = multer.diskStorage({
     destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'));
     },
     filename:function(req,file,cb){
          const name= Date.now+"-"+file.originalname;
          cb(null,name);
     }
});

const upload = multer({storage:storage});

// admin_route.get('/login',adminController.login);

admin_route.get('/blog-setup',adminController.blogSetup);
admin_route.post('/blog-setup', upload.single("blog_image"),adminController.blogSetupSave);

admin_route.get('/dashboard',adminLoginAuth.is_login,adminController.dashboard);

admin_route.get('/create-post',adminLoginAuth.is_login,adminController.loadPostDashboard);
admin_route.post('/create-post',adminLoginAuth.is_login,adminController.addPost);

admin_route.post('/upload-post-image', upload.single("image"), adminLoginAuth.is_login,adminController.uploadPostImage);

admin_route.post('/delete-post',adminLoginAuth.is_login,adminController.deletePost);
admin_route.get('/edit-post/:id',adminLoginAuth.is_login,adminController.loadEditPost);
admin_route.post('/update-post',adminLoginAuth.is_login,adminController.updatePost);


module.exports=admin_route;