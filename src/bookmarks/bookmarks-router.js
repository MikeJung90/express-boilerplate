const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const store = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(store.bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { title, url, desc='', rating='5'} = req.body;

    if(!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!url) {
      logger.error('URL is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      desc,
      rating
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(200)
      .location(`/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    res.json(bookmark)
  })

  .delete((req, res) => {
    const { id } = req.params

    const bookmarkIndex = store.bookmarks.findIndex(bookmark => bookmark.id === id)

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    store.bookmarks.splice(bookmarkIndex, 1)

    logger.info(`Bookmark with id ${id} deleted.`)
    res
      .status(200)
      .end()
  })

module.exports = bookmarksRouter