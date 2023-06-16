const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const configs = require("../config/config");
const adminController = require("../controllers/adminController");

const sendResetPasswordMail = async (name, email, token) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: configs.emailUser,
        pass: configs.emailPassword,
      }
    });

    const mailOptions = {
      from: configs.emailUser,
      to: email,
      subject: "reset Password",
      html:
        "<p>Hii" +
        name +
        ', Please click here to <a href="http://127.0.0.1:3000/reset-password?token=' +
        token +
        '">Reset</a>your Password.',
    };
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been send :-", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
console.log(email);
    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.user_id = userData._id;
        req.session.is_admin = userData.is_admin;
        if (userData.is_admin == 1) {
          res.redirect("/dashboard");
        } else {
          res.redirect("/profile");
        }
      } else {
        res.render("login", { message: "email and password is incorrect" });
      }
    } else {
      res.render("login", { message: "email and password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const profile = async (req, res) => {
  try {
    res.send("profile here");
  } catch (error) {
    console.log(error.message);
  }
};
const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};
const forgetLoad = async (req, res) => {
  try {
    res.render("forget-password");
  } catch (error) {
    console.log(error.message);
  }
};
const forgetPasswordVerify = async (req, res) => {
  try {
    const emails = req.body.email;
    console.log(emails);
    const password =req.body.password;
    console.log(password);
    const userData = await User.findOne({ email: emails });
    console.log(userData);
    if (userData) {
      const randomString = randomstring.generate();
      await User.updateOne(
        { email: emails },
        { $set: { token: randomString } }
      );
      sendResetPasswordMail(userData.name, userData.email, randomString);
      res.render("forget-password", {
        message: "Please check your mail to reset your password !",
      });
    } else {
      res.render("forget-password", { message: "User email is incorrect!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const resetPasswordLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      res.render("reset-password", { user_id: tokenData._id });
    } else {
      res.render("404");
    }
    res.render("forget-password");
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword =async(req,res)=>{
    try {
        const password=req.body.password;
        const user_id=req.body.user_id;

        const securePassword = await adminController.securePassword(password);
       await User.findByIdAndUpdate({ _id:user_id },{ $set:{password:securePassword,token:""}});
       res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
  loadLogin,
  verifyLogin,
  profile,
  logout,
  forgetLoad,
  forgetPasswordVerify,
  resetPasswordLoad,
  resetPassword
};
