import express from 'express';
import mongoose from 'mongoose';
// import console from 'console';
import { boardSchema } from '../db_schema';

const router = express.Router();

// router.get('/board', );

// router.get('/login', );

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

  const board = mongoose.model('Board', boardSchema);
  const findResult = await board.find()
    .select('_id title body')
    .skip(10 * page)
    .limit(10)
    .sort({ createAt: 'descending' })
    .exec();

  if (!findResult) {
    next();
    return;
  }

  res.render('index.ejs', {
    totalCount: await board.countDocuments(),
    indexNum: findResult.length,
    data: findResult,
    user: {
      role: undefined,
    },
  });
});

export default router;
