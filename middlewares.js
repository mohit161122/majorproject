module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;      //after logion user will be redirected to the page he wanted to access before login
    req.flash("error" , "You must be signed in to create a new listing!");
    return res.redirect("/login");
  }
  next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


