const express = require('express');
const logger = require('./logger');
const bookmarksRouter = express.Router();
const {bookmarks} = require('./store');
const uuid = require('uuid/v4');
const bodyParser = express.json();



bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })

  .post(bodyParser, (req, res) => {
    const { title, url, rating, description } = req.body;

    if (!title) {
      return res
        .status(400)
        .send('Title required');
    }
    if (!url) {
      return res
        .status(400)
        .send('URL required');
    }
    if (!rating) {
      return res
        .status(400)
        .send('Rating required');
    }
    if (!description) {
      return res
        .status(400)
        .send('Description required');
    }
    const id = uuid();
    const newBookmark = {
      id,
      title,
      url,
      rating,
      description
    };
  
    bookmarks.push(newBookmark);
  
    res
      .status(201)
      .send('All validations passed!');
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const {id} = req.params;
    const bookmark = bookmarks.find(bm => bm.id === id);
    if(!id) {
      logger.error(`bookmark with id: ${id} not found!`);
      return res
        .status(404)
        .send('bookmark not found');
    }
    res.json(bookmark);
  })

  .delete((req, res) => {
    const {id} = req.params;
    const index = bookmarks.findIndex(bm => bm.id === id);

    if (index === -1) {
      return res
        .status(404)
        .send('User not found');
    }

    bookmarks.splice(index, 1);

    res 
      .status(204)
      .send(`bookmark with id: ${id} was deleted`)
      .end();
  });

module.exports = bookmarksRouter;