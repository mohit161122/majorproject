const express = require('express');
const app = express();
const port = 3000;
const users = require('./routes/user.js');
const posts= require('./routes/post.js');
const cookieParser = require('cookie-parser');


app.use(cookieParser("secretecode"));
//send cookies
app.get("/getsignedcookies" , (req,res) => {
  res.cookie("Mande-in" , "India", {signed: true} );
  res.send("send you some signed cookies! ");
});
//verify cookies
app.get("/verify", (req,res)=> {
  console.log(req.signedCookies);
  res.send("varified");
})



//cookies
app.get("/getcookies" , (req,res)=>{
  res.cookie("greet", "namastae");
  res.cookie("madeIn" , "India");
  res.send("send you some cookies! ");
});

app.get("/greet" , (req , res) => {
  let {name = "anonymous"} = req.cookies;
  res.send(`Hi, ${name}!`);
});



app.get('/', (req, res) => {
  console.dir(req.cookies);
  res.send('Hi, I am root!')
});


app.use( "/users" , users);
app.use( "/posts" , posts);


app.listen(port, () => {
  console.log(`Server is listening to  ${port}`)
});