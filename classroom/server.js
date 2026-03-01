const express = require('express');
const app = express();
const port = 3000;
const users = require('./routes/user.js');
const posts= require('./routes/post.js');
const session = require("express-session");
const flash = require("connect-flash");
const { name } = require('ejs');
const path = require('path');

app.set("view engine" , "ejs" );
app.set("views" , path.join(__dirname, "views"));

const sessionOptions = { 
  secret: "mysupersecretstring" ,
   resave: false ,
    saveUninitialized: true
};

app.use(session(sessionOptions));
 app.use(flash());

app.get("/register" , (req,res) => {
  let { name = "Anonymous"} = req.query;
  req.session.name = name;
  req.flash("sucess" , " user is registered successfully! ");
  res.redirect("/hello");
});

app.get("/hello" ,(req,res) => {
  
  res.render("page.ejs" , {name: req.session.name, msg: req.flash("sucess")});
});



// app.use(session({secret: "mysupersecretstring" , resave: false , saveUninitialized: true} ));





// app.get ("/request" , (req,res) => {
//   if(req.session.count){
//     req.session.count++;
//   }else{
//     req.session.count = 1;
//   }
//   res.send(`you send a request ${req.session.count} times`); 
// });





// app.get("/test" , (req,res) => {
//   res.send("test is successful")
// })



app.listen(port, () => {
  console.log(`Server is listening to  ${port}`)
});


