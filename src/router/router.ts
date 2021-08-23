import express from 'express';
import mongoose from 'mongoose';
import console from 'console';
import { boardSchema } from '../db_schema';

const router = express.Router();

// router.get('/board', );

// router.get('/login', );

router.get('/', (req, res) => {
  const page: number = parseInt(req.query.page as string) ?? 0;
  const board = mongoose.model('Board', boardSchema);
  board.find()
    .select('_id title body')
    .skip(10 * page)
    .limit(10)
    .sort({ createAt: 'descending' })
    .then(async (result) => {
      res.render('index.ejs', {
        totalCount: await board.find().select('_id').countDocuments(),
        indexNum: result.length,
        data: result,
        user: {
          role: undefined,
        },
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

export default router;
