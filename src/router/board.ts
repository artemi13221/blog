import express from 'express';
import { Types } from 'mongoose';
import { BoardModel } from '../mongooseSchema';

const router = express.Router();
const findFailResultError = new Error('Mongoose Error: Cant find db by _id');

// Writer Page
router.get('/newpost', async (req, res, next) => {
  const postId = req.query.id ?? 'undefined';
  try {
    if (typeof postId !== 'string') {
      throw new Error('Wrong parameter. Check your parameter');
    }

    if (postId !== 'undefined') {
      const result = await BoardModel.findOne({
        _id: Types.ObjectId(postId),
      }).select('title body');

      if (!result) {
        throw findFailResultError;
      }

      res.render('newpost.ejs', {
        data: result,
      });
      return;
    }

    res.render('newpost.ejs', {
      data: {
        title: '',
        body: '',
      },
    });
  } catch (error) {
    next(error);
  }
});

// Read a board.
router.get('/:id', async (req, res, next) => {
  const postId = req.params.id;
  try {
    const result = await BoardModel.findOne({
      _id: Types.ObjectId(postId),
    });

    if (!result) {
      throw findFailResultError;
    }

    res.render('post.ejs', {
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// Check Session role
router.use((req, res, next) => {
  if ((req.session as any).role !== 'admin') {
    res.send('role-error');
    return;
  }
  next();
});

// Write a board and create db
router.post('/', async (req, res, next) => {
  const data = req.body;
  const insertData = new BoardModel({
    poster: 'test',
    title: data.title,
    body: data.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  });
  try {
    await insertData.save();
    res.send('ok');
  } catch (error) {
    next(error);
  }
});

// Modify a board and update db
router.put('/', async (req, res, next) => {
  const data = req.body;
  const postId = data.id;
  try {
    await BoardModel.updateOne({
      _id: Types.ObjectId(postId),
    }, {
      title: data.title,
      body: data.body,
      updatedAt: new Date(),
    });
    res.send('ok');
  } catch (error) {
    next(error);
  }
});

// Delete a board and delete db
router.delete('/', async (req, res, next) => {
  const postId = req.body.id;
  try {
    await BoardModel.updateOne({
      _id: Types.ObjectId(postId),
    }, {
      deletedAt: new Date(),
      isDeleted: true,
    });
    res.send('ok');
  } catch (error) {
    next(error);
  }
});

// export module
const boardRouter = router;
export { boardRouter };
