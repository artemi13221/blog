import express from 'express';
import mongoose from 'mongoose';
import { boardSchema } from '../db_schema';

const router = express.Router();
const Board = mongoose.model('Board', boardSchema);

// Write a board and create db
router.post('/', async (req, res, next) => {
  const data = req.body;
  const insertData = new Board({
    title: data.title,
    body: data.body,
    createAt: data.createAt,
    modifiedAt: data.modifiedAt,
  });
  try {
    await insertData.save();
  } catch (error) {
    next(error);
  }
  res.send('ok');
});

// Modify a board and update db
router.put('/', async (req, res, next) => {
  let boardID: mongoose.Types._ObjectId;
  const data = req.body;
  if (data.id) {
    next();
    return;
  }

  try {
    boardID = mongoose.Types.ObjectId(data.id);
    await Board.updateOne({
      _id: boardID,
    }, {
      title: data.title,
      body: data.body,
      modifiedAt: data.modifiedAt,
    });
  } catch (error) {
    next(error);
    return;
  }

  res.send('ok');
});

// Delete a board and delete db
router.delete('/', async (req, res, next) => {
  let boardID: mongoose.Types._ObjectId;
  if (!req.body.id || typeof req.body.id !== 'string') {
    next();
    return;
  }
  try {
    boardID = mongoose.Types.ObjectId(req.body.id);
    if (await Board.findOne({ _id: boardID })) {
      await Board.deleteOne({ _id: boardID });
    } else {
      throw new Error('undefined boardID');
    }
  } catch (error) {
    next(error);
    return;
  }

  res.send('ok');
});

// Writer Page
router.get('/newpost', async (req, res, next) => {
  let boardID: mongoose.Types._ObjectId;
  req.query.id = req.query.id ?? 'undefined';

  if (typeof req.query.id !== 'string') {
    next();
    return;
  }
  let findResult: mongoose.Callback;
  if (req.query.id === 'undefined') {
    res.render('newpost.ejs', {
      data: {
        title: '',
        body: '',
      },
    });
    return;
  }

  try {
    boardID = mongoose.Types.ObjectId(req.query.id);
    findResult = await Board.findOne({ _id: boardID }).select('title body');
  } catch (error) {
    next(error);
    return;
  }
  res.render('newpost.ejs', {
    data: findResult,
  });
});

// Read a board.
router.get('/:id', async (req, res, next) => {
  let boardID: mongoose.Types._ObjectId;
  let findResult: mongoose.Callback;
  try {
    boardID = mongoose.Types.ObjectId(req.params.id);
    findResult = await Board.findOne({ _id: boardID });
  } catch (error) {
    next(error);
    return;
  }
  if (!findResult) {
    next();
    return;
  }

  res.render('post.ejs', {
    data: findResult,
  });
});

export default router;
