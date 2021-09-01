import express from 'express';
import { BoardModel } from '../mongooseSchema';
import { boardRouter } from './board';
import { loginRouter } from './login';

const router = express.Router();
router.use('/board', boardRouter);

router.use('/login', loginRouter);

router.get('/', async (req, res, next) => {
  const queryPage = req.query.page ?? '1';
  if (typeof queryPage !== 'string') {
    next();
    return;
  }
  const page: number = parseInt(queryPage, 10) - 1;
  if (page < 0) {
    next();
    return;
  }
  const findResult = await BoardModel.find({ isDeleted: false })
    .select('_id title body')
    .skip(10 * page)
    .limit(10)
    .sort({ createdAt: 'descending' })
    .exec();

  if (!findResult) {
    next();
    return;
  }

  res.render('index.ejs', {
    totalCount: await BoardModel.countDocuments({ isDeleted: false }),
    indexNum: findResult.length,
    data: findResult,
    user: {
      id: (req.session as any).user,
      role: (req.session as any).role,
    },
  });
});

export default router;
