import express from 'express';
// import { Types } from 'mongoose';
import { UserModel } from '../mongooseSchema';

const router = express.Router();

// GET Login Page
router.get('/', (req, res) => {
  res.render('login.ejs');
});

// POST Login and logout
router.post('/', async (req, res, next) => {
  const data = req.body;
  if (data.type !== 'login') {
    req.session.destroy(() => req.session);
    res.redirect('/');
    return;
  }

  try {
    const loginData = await UserModel.findOne({
      id: data.id,
    });
    if (loginData === null) {
      throw new Error('ID를 찾을 수 없습니다.');
    }

    if (loginData.pw !== data.pw) {
      throw new Error('PW가 일치하지 않습니다.');
    }
    (req.session as any).user = loginData.id;
    (req.session as any).role = loginData.role;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// GET Register Page
router.post('/register', async (req, res, next) => {
  const data = req.body;
  if (data.pw !== data.repw) {
    res.send('password');
    return;
  }

  const loginData = new UserModel({
    id: data.id,
    pw: data.pw,
    name: data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    deletedAt: new Date(-1),
  });

  try {
    await loginData.save();
    res.send('회원가입이 완료되었습니다.');
  } catch (error) {
    next(error);
  }
});

const loginRouter = router;
// Module export
export { loginRouter };
