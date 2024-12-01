require('dotenv').config({path:'./.env'});
const port = process.env.PORT;

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const connectDB = require('./config/mongo');

const userRoutes = require('./config/routes/userroutes.js');
const loginroutes = require('./config/routes/loginauthenticationroutes');
const eventroutes = require('./config/routes/eventroutes');
const messageroute = require('./config/routes/messageroute');
const jobroute = require('./config/routes/jobroute')

const passport = require('./config/passport-config');
const user = require('./models/alumni');
const servicesroute = require('./config/routes/servicesroute.js');


const {hashPassword, verifypassword, isAuthenticated} = require('./config/util');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/protected-styles', express.static(path.join(__dirname, 'protected', 'protected-styles')));
app.use('/protected-scripts', express.static(path.join(__dirname, 'protected', 'protected-scripts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

connectDB();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(session({
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());



app.post('/submit-alumni', async (req, res) => {
  try{
    const { personname, userid, usertype, email, getpassword, personimage, details } = req.body;
    const {salt, passwordhash} = hashPassword(getpassword);
    const image = personimage || undefined;
    const newdetails = {
      batch: details.batch,
      branch: details.branch,
      aboutme: details.aboutme || undefined,
      education: details.education || undefined,
      currentrole: details.currentrole || undefined,
      experience: details.experience || undefined,
      contactinfo: details.contactinfo || undefined,
      };
    const newUser = new user({
      personname,
      userid,
      usertype,
      email,
      salt,
      passwordhash,
      personimage: image,
      details: newdetails, 
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
    console.log(err);
    res.status(500).json({error:'Failed to save data'});
  }
  }
);

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))            
})

app.get('/login', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))            
})



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
 
app.get('/logout', (req, res) => {
  req.logOut((err) => {
    if(err) {
      return res.status(500).send("failed to logout")
    }
  
    res.redirect('/login')
  })
})

app.get('/dashboard', (req,res) => {
  if(req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
  }
  else {
  res.redirect(`/login?alert=not-logged-in`);
  }
});

app.use(loginroutes);
app.use(messageroute);
app.use('/protected', isAuthenticated, jobroute);
app.use('/protected', isAuthenticated, servicesroute);
app.use('/protected', isAuthenticated, messageroute);
app.use('/protected', isAuthenticated, eventroutes);
app.use('/protected', isAuthenticated, userRoutes);


app.listen(port ,() => {console.log(`server is running at port ${port}`)});




