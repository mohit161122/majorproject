const express = require('express')
const app = express()
const port = 3000
const users = require('./routes/user.js')
const posts= require('./routes/post.js')



app.get('/', (req, res) => {
  res.send('Hi, I am root!')
});


app.use( "/users" , users);
app.use( "/posts" , posts);


app.listen(port, () => {
  console.log(`Server is listening to  ${port}`)
})