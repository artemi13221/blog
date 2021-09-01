import express from 'express';
// import { Types } from 'mongoose';
import { UserModel } from '../mongooseSchema';

const router = express.Router();

// GET Login Page
router.get('/', (req, res) => {
  res.render('login.ejs');
});

// POST Login and logout
router.post('/', (req, res) => {
  res.send(null);
});

// GET Register Page
router.post('/register', (req, res) => {
  const data = req.body;
  res.send(data);
});

const loginRouter = router;
// Module export
export { loginRouter };
