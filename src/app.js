const express = require('express');
const mongodb = require('mongodb').MongoClient;
const { json: bodyParserJson } = require('body-parser');
require('dotenv').config();

const mongodbUrl = process.env.MONGODB_URL;
const app = express();

class BoardData {
  constructor(id, title, body, createAt, modifiedAt) {
    this.id = id;
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
    app.use(bodyParserJson());
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

    app.post('/board', (req, res) => {
      const data = req.body;
      boardCollections.insertOne(
        new BoardData(data.id, data.title, data.body, data.createAt, data.modifiedAt),
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

    app.listen(3000, () => {
      console.log('3000port server open!');
    });
  })
  .catch((error) => console.error(error));
