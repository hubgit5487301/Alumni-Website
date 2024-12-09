require('dotenv').config({path:'./.env'});
const port = process.env.PORT;
const key = process.env.KEY;
const mongoURI = process.env.mongoURI; 


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const connectDB = require('./config/mongo');

const basicroutes = require('./config/routes/basicroutes.js')
const userRoutes = require('./config/routes/userroutes.js');
const loginroutes = require('./config/routes/loginauthenticationroutes');
const eventroutes = require('./config/routes/eventroutes');
const messageroute = require('./config/routes/messageroute');
const jobroute = require('./config/routes/jobroute');
const servicesroute = require('./config/routes/servicesroute');

const passport = require('./config/passport-config');

const {isAuthenticated} = require('./config/util');
const otps = require('./models/otps.js');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/protected-styles', express.static(path.join(__dirname, 'protected', 'protected-styles')));
app.use('/protected-scripts', express.static(path.join(__dirname, 'protected', 'protected-scripts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

connectDB();

app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoURI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    secure: false,
    maxAge: 60000 * 60 *12,
  }
}));

app.set('trust proxy', 1); 

app.use(passport.initialize());
app.use(passport.session());


app.use(basicroutes)
app.use(loginroutes);
app.use(messageroute);
app.use('/protected', isAuthenticated, jobroute);
app.use('/protected', isAuthenticated, servicesroute);
app.use('/protected', isAuthenticated, messageroute);
app.use('/protected', isAuthenticated, eventroutes);
app.use('/protected', isAuthenticated, userRoutes);


app.listen(port ,() => {console.log(`server is running at port ${port}`)});


setInterval( async() => {
  const now = new Date(Date.now() - 10 * 60 * 1000);
  try{
    const result = await otps.deleteMany({createdAt: {$lt: now}});
    console.log(`Deleted ${result.deletedCount} expired otps`);
  }
catch(err) {
  console.log(err);
}
}, 1000 * 60 * 10);
