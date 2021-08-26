import express from 'express';
// import { Types } from 'mongoose';
// import { UserModel } from '../mongooseSchema';

const router = express.Router();

// GET Login Page
router.get('/', (req, res) => {
  res.render('login.ejs');
});

// POST Login and logout
router.post('/');

// GET Register Page
router.get('/register', (req, res) => {
  res.send(null);
});

const loginRouter = router
// Module export
export { loginRouter };
