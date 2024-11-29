require('dotenv').config({path:'./.env'});
const port = process.env.PORT;

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');

const connectDB = require('./config/mongo');
const userRoutes = require('./config/userroutes');
const passport = require('./config/passport-config');
const user = require('./config/alumni');
const {hashPassword, verifypassword} = require('./config/util.js');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/protected-styles', express.static(path.join(__dirname, 'protected', 'protected-styles')));
app.use('/protected-scripts', express.static(path.join(__dirname, 'protected', 'protected-scripts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());




app.post('/submit-alumni', async (req, res) => {
  try{
  const { personname, userid, email, getpassword, persondefaultimage, details } = req.body;
  const {salt, passwordhash} = hashPassword(getpassword);

  let personimage = persondefaultimage;
  if (!personimage) {
    personimage = 'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmZmZmYiPgoNPGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz4KDTxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgoNPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPiA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjAwMDEgMS4yNUM5LjM3Njc4IDEuMjUgNy4yNTAxMyAzLjM3NjY1IDcuMjUwMTMgNkM3LjI1MDEzIDguNjIzMzUgOS4zNzY3OCAxMC43NSAxMi4wMDAxIDEwLjc1QzE0LjYyMzUgMTAuNzUgMTYuNzUwMSA4LjYyMzM1IDE2Ljc1MDEgNkMxNi43NTAxIDMuMzc2NjUgMTQuNjIzNSAxLjI1IDEyLjAwMDEgMS4yNVpNOC43NTAxMyA2QzguNzUwMTMgNC4yMDUwNyAxMC4yMDUyIDIuNzUgMTIuMDAwMSAyLjc1QzEzLjc5NTEgMi43NSAxNS4yNTAxIDQuMjA1MDcgMTUuMjUwMSA2QzE1LjI1MDEgNy43OTQ5MyAxMy43OTUxIDkuMjUgMTIuMDAwMSA5LjI1QzEwLjIwNTIgOS4yNSA4Ljc1MDEzIDcuNzk0OTMgOC43NTAxMyA2WiIgZmlsbD0iI2ZmZmZmZiIvPiA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjAwMDEgMTIuMjVDOS42ODY1OCAxMi4yNSA3LjU1NTA2IDEyLjc3NTkgNS45NzU1OCAxMy42NjQzQzQuNDE5NjIgMTQuNTM5NiAzLjI1MDEzIDE1Ljg2NjEgMy4yNTAxMyAxNy41TDMuMjUwMDcgMTcuNjAyQzMuMjQ4OTQgMTguNzYzOCAzLjI0NzUyIDIwLjIyMiA0LjUyNjU1IDIxLjI2MzVDNS4xNTYwMiAyMS43NzYxIDYuMDM2NjEgMjIuMTQwNiA3LjIyNjM0IDIyLjM4MTVDOC40MTk0IDIyLjYyMjkgOS45NzQzNiAyMi43NSAxMi4wMDAxIDIyLjc1QzE0LjAyNTkgMjIuNzUgMTUuNTgwOSAyMi42MjI5IDE2Ljc3MzkgMjIuMzgxNUMxNy45NjM3IDIyLjE0MDYgMTguODQ0MyAyMS43NzYxIDE5LjQ3MzcgMjEuMjYzNUMyMC43NTI3IDIwLjIyMiAyMC43NTEzIDE4Ljc2MzggMjAuNzUwMiAxNy42MDJMMjAuNzUwMSAxNy41QzIwLjc1MDEgMTUuODY2MSAxOS41ODA3IDE0LjUzOTYgMTguMDI0NyAxMy42NjQzQzE2LjQ0NTIgMTIuNzc1OSAxNC4zMTM3IDEyLjI1IDEyLjAwMDEgMTIuMjVaTTQuNzUwMTMgMTcuNUM0Ljc1MDEzIDE2LjY0ODcgNS4zNzE1MSAxNS43MjUxIDYuNzEwOTggMTQuOTcxN0M4LjAyNjkzIDE0LjIzMTUgOS44OTU0MSAxMy43NSAxMi4wMDAxIDEzLjc1QzE0LjEwNDkgMTMuNzUgMTUuOTczMyAxNC4yMzE1IDE3LjI4OTMgMTQuOTcxN0MxOC42Mjg4IDE1LjcyNTEgMTkuMjUwMSAxNi42NDg3IDE5LjI1MDEgMTcuNUMxOS4yNTAxIDE4LjgwNzggMTkuMjA5OCAxOS41NDQgMTguNTI2NSAyMC4xMDA0QzE4LjE1NiAyMC40MDIyIDE3LjUzNjYgMjAuNjk2NyAxNi40NzYzIDIwLjkxMTNDMTUuNDE5NCAyMS4xMjUyIDEzLjk3NDQgMjEuMjUgMTIuMDAwMSAyMS4yNUMxMC4wMjU5IDIxLjI1IDguNTgwODcgMjEuMTI1MiA3LjUyMzkzIDIwLjkxMTNDNi40NjM2NiAyMC42OTY3IDUuODQ0MjUgMjAuNDAyMiA1LjQ3MzcyIDIwLjEwMDRDNC43OTA0NSAxOS41NDQgNC43NTAxMyAxOC44MDc4IDQuNzUwMTMgMTcuNVoiIGZpbGw9IiNmZmZmZmYiLz4gPC9nPgoNPC9zdmc+';
  }
  const newUser = new user({
    personname,
    userid,
    email,
    salt,
    passwordhash,
    personimage,
    details, 
  });
  
  const finduserbyuserid = await user.findOne({"userid":userid});
  const finduserbyuseremail = await user.findOne({"email":email});
  if(!finduserbyuserid && !finduserbyuseremail) {
    await newUser.save();
    res.status(200).json({message:'Data submitted'});
  }
  
  if(finduserbyuserid){
     return res.status(409).json({message:'user already exists'})
    }
  
  if(finduserbyuseremail) {
    return res.status(409).json({message:'email already exists'})
    }
  }
  catch(err) {
    res.status(500).json({error:'Failed to save data'});
    console.log(err);
  }
}
);

app.get('/login', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))            
  
})


function isAuthenticated (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
    res.redirect('/login')
  
}


app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed' });
      }
      return res.status(200).json({ message: 'Login successful' });
    });
  })(req, res, next);
});
  



app.get('/dashboard', (req,res) => {
  if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
  }
else {
  res.redirect('/login');
  }
});



app.get('/logout', (req, res) => {
  req.logOut((err) => {
    if(err) {
      return res.status(500).send("failed to logout")
    }
  
    res.redirect('/login')
  })
})




app.use('/protected', isAuthenticated, userRoutes);


app.listen(port ,() => {console.log(`server is running at port ${port}`)});




