const express = require('express');
const mongodb = require('mongodb').MongoClient;
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

    app.get('/:id', (req, res) => {
      console.log(req);
      res.send('ok');
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

    app.put('/board', (req, res) => {
      const data = req.body;
      boardCollections.findOne({
        id: data,
      })
        .then((result) => {
          console.log(result);
          res.send('ok');
        })
        .catch((error) => console.error(error));
    });

    app.listen(10001, () => {
      console.log('10001port server open!');
    });
  })
  .catch((error) => console.error(error));
