// const express = require('express');
import express from 'express';
// const mongodb = require('mongodb').MongoClient;
import { MongoClient } from 'mongodb';
// const { ObjectId } = mongodb;
import { ObjectId } from 'mongodb';
// const { json: bodyParserJson } = require('body-parser');
// require('dotenv').config();
import { config } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as Session from 'express-session';

const HOURS = 1000 * 60 * 60;
config(); // dotenv activated.

const mongodbUrl: string | undefined = process.env.MONGODB_URL;
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
    
    if (typeof process.env.SECRET === 'string') {
      app.use(Session.default({
        secret: process.env.SECRET,
        saveUninitialized: true,
        cookie: {
          maxAge: HOURS,
        },
        resave: false,
      }));
    } else {
      console.log("Please make .env file and write SECRET Key");
      return;
    }
    
    app.use(express.static(`${__dirname}/../public`));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser.default());
    app.set('view engine', 'ejs');
    
    let session: any;

    app.get('/', (req, res) => {
      session = req.session;
      boardCollections.find().toArray()
      .then((result) => {
        res.render('index.ejs', {
          totalCount: result.length,
          data: result,
          user: {
            role: session.userid,
          }
        });
      })
      .catch((error) => console.error(error));
    });
    
    app.get('/login', (req, res) => {
      res.render('login.ejs');
    });

    app.post('/login', (req, res) => {
      if (req.body.id === process.env.ID && req.body.pw === process.env.PASSWORD) {
        session = req.session;
        session.userid = req.body.id;
        console.log(session);
        res.redirect('/');
      }
      else {
        res.send('invalid id or pw');
      }
    });

    app.get('/logout', (req, res) => {
      req.session.destroy(() => req.session);
      res.redirect('/');
    })

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
          session = req.session;
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
            if (session.userid === 'artemi') {
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
            }
            else {
              res.redirect('/');
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
  