const express = require('express');
const mongodb = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
// const { json: bodyParserJson } = require('body-parser');
require('dotenv').config();

const mongodbUrl = process.env.MONGODB_URL;
const app = express();

class BoardData {
  constructor(title, body, createAt, modifiedAt) {
    this.title = title;
    this.body = body;
    this.createAt = createAt;
    this.modifiedAt = modifiedAt;
  }
}

mongodb.connect(mongodbUrl)
  .then((client) => {
    console.log('connected to database');

    const db = client.db('blog');
    const boardCollections = db.collection('board');

    app.use(express.static(`${__dirname}/../public`));
    app.use(express.json());
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => {
      boardCollections.find().toArray()
        .then((result) => {
          res.render('index.ejs', {
            totalCount: result.length,
            data: result,
          });
        })
        .catch((error) => console.error(error));
    });

    app.get('/board/:id', (req, res) => {
      try {
        boardCollections.findOne({
          _id: new ObjectId(req.params.id),
        })
          .then((result) => {
            res.render('post.ejs', {
              data: result,
            });
          })
          .catch((error) => console.error(error));
      } catch (error) {
        res.status(404).send('404 ERROR');
      }
    });

    app.post('/board', (req, res) => {
      const data = req.body;
      boardCollections.insertOne(
        new BoardData(data.title, data.body, data.createAt, data.modifiedAt),
      )
        .then((result) => {
          res.send('ok');
        })
        .catch((error) => console.error(error));
    });

    app.get('/newpost', (req, res) => {
      const data = req.query;
      try {
        boardCollections.findOne({
          _id: new ObjectId(data.id),
        })
          .then((result) => {
            if (result === undefined) {
              res.render('newpost.ejs', {
                data: {
                  title: '',
                  body: '',
                },
              });
            } else {
              res.render('newpost.ejs', {
                data: result,
              });
            }
          })
          .catch((error) => console.error(error));
      } catch (error) {
        res.status(404).send('ERROR 404');
      }
    });

    app.put('/board', (req, res) => {
      try {
        const data = req.body;
        boardCollections.updateOne({
          _id: new ObjectId(data.id),
        }, {
          $set: {
            title: data.title,
            body: data.body,
            modifiedAt: data.modifiedAt,
          },
        })
          .then((result) => {
            res.send('ok');
          })
          .catch((error) => console.error(error));
      } catch (error) {
        res.status(404).send('ERROR 404');
      }
    });

    app.delete('/board', (req, res) => {
      const data = req.body;
      boardCollections.deleteOne({
        _id: new ObjectId(data.id),
      })
        .then((result) => {
          if (result.deletedCount === 0) {
            res.send('error');
          } else {
            res.send('ok');
          }
        })
        .catch((error) => console.error(error));
    });

    app.listen(10001, () => {
      console.log('10001port server open!');
    });
  })
  .catch((error) => console.error(error));
