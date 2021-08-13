// const express = require('express');
import express from 'express';
// const mongodb = require('mongodb').MongoClient;
import { MongoClient } from 'mongodb';
// const { ObjectId } = mongodb;
import { ObjectId } from 'mongodb';
// const { json: bodyParserJson } = require('body-parser');
// require('dotenv').config();
import { config } from 'dotenv';

config();

const mongodbUrl: string = process.env.MONGODB_URL as string;
const app: express.Application = express();

class BoardData {
  title: string;
  body: string;
  createAt: Date;
  modifiedAt: Date;

  constructor(title: string, body: string, createAt: Date, modifiedAt: Date) {
    this.title = title;
    this.body = body;
    this.createAt = createAt;
    this.modifiedAt = modifiedAt;
  }
}

if (mongodbUrl === undefined) {
   console.log("Please make .env file and write MONGODB_URL");
} else {
  MongoClient.connect(mongodbUrl)
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
          user: {
            role: undefined
          }
        });
      })
      .catch((error) => console.error(error));
    });
    
    app.get('/board/:id', (req, res) => {
      let boardID: ObjectId;
      try {
        boardID = new ObjectId(req.params.id);
      } catch (error) {
        res.status(404).send(`404 ERROR!! <br> ${error}`);
        return;
      }
      
      boardCollections.findOne({
        _id: boardID,
      })
      .then((result) => {
        res.render('post.ejs', {
          data: result,
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(404).send('404 ERROR!');
        }
        );
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
          let boardID: ObjectId;
          try {
            boardID = new ObjectId(req.query.id as string);
          } catch (error) {
            res.status(404).send(`404 ERROR!! <br> ${error}`);
            return;
          }
          
          boardCollections.findOne({
            _id: boardID,
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
        });
        
        app.put('/board', (req, res) => {
          let boardID: ObjectId;
          try {
            boardID = new ObjectId(req.body.id);
          } catch (error) {
            res.status(404).send(`404 ERROR!! <br> ${error}`);
            return;
          }
          
          const data = req.body;
        boardCollections.updateOne({
          _id: boardID
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
        });
        
        app.delete('/board', (req, res) => {
          let boardID: ObjectId;
          try {
            boardID = new ObjectId(req.body.id);
          } catch (error) {
            res.status(404).send(`404 ERROR!! <br> ${error}`);
            return;
      }
      
      const data = req.body;
      boardCollections.deleteOne({
        _id: boardID,
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
}
  