import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import console from 'console';
import Router from './router/router'

dotenv.config();

// connect db part
async function connectMongoose() {
  if (typeof process.env.MONGODB_URL === 'undefined') {
    console.error('Check your dotenv file and add MONGODB_URL');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      dbName: 'blog',
    });
  } catch (error) {
    console.error('Database connected fail. Check your Internet or MONGODB_URL');
  }
}

// Express app main
const app = express();
connectMongoose();
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connect Database');
});

if (typeof process.env.COOKIE_SECRET !== 'string') {
  console.error('Check your dotenv file and add COOKIE_SECRET');
  process.exit(1);
}
// Express middleware
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
  secret: process.env.COOKIE_SECRET,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2HOURS maxAge
  },
  resave: false,
}));
app.set('view engine', 'ejs');

// Router
app.use(Router);

// listen
app.listen(10002, () => {
  console.log('10001port server open!');
});
