import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import dotenv from 'dotenv';
import mongoose, { Error } from 'mongoose';
import console from 'console';
import Router from './router/router';

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
const port = process.env.PORT ?? 10002;

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

// Status 404
app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  res.locals.errNum = 404;
  next(err);
});

// Error Handling function
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(res.locals.errNum ?? 500);
  res.render('error.ejs');
  next();
});

// listen
app.listen(10002, () => {
  console.log(`PORT: ${port}, server open!`);
});
