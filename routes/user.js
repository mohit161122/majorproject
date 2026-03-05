const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl } = require('../middlewares.js');

const userControllers = require("../constollers/users.js")

router.get("/signup" , userControllers.renderSignupForm);

router.post("/signup" , wrapAsync(userControllers.signup));

router.get("/login" ,userControllers.renderLoginForm );

router.post('/login', saveRedirectUrl,passport.authenticate('local', {failureRedirect: '/login' ,failureFlash: true,})
   , userControllers.login);

  router.get("/logout" , userControllers.logout);

module.exports = router;
