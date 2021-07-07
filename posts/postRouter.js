const express = require('express');
const posts = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
  // Gets List of All Posts:
  posts.get().then((posts) => {
    res.status(200).json(posts);
  });
});

router.get('/:id', validatePostId, (req, res) => {
  // Retrieve Posts by ID:
  const paramsID = req.params.id;
  posts.getById(paramsID).then((post) => {
    res.status(200).json(post);
  });
});

router.delete('/:id', validatePostId, (req, res) => {
  // Removes a post based on the ID
  const paramsID = req.params.id;
  posts.remove(paramsID).then((itemsRemoved) => {
    if (itemsRemoved === 1) {
      res.status(200).send({ SUCCESS: `${itemsRemoved} POST WAS DELETED` });
    } else {
      res.status(200).send({ SUCCESS: `${itemsRemoved} POSTS WERE DELETED` });
    }
  });
});

router.put('/:id', validatePostId, (req, res) => {
  // UPDATES POST BASED ON ID:
  const paramsID = req.params.id;
  const data = req.body;
  posts.update(paramsID, data).then((count) => {
    if (count === 1) {
      res.status(200).send({ SUCCESS: `${count} POST WAS UPDATED` });
    } else {
      res.status(200).send({ SUCCESS: `${count} POSTS WERE UPDATED` });
    }
  });
});

// custom middleware

function validatePostId(req, res, next) {
  // VALIDATES THE POSTS WITH ID's:
  const id = req.params.id;
  posts.getById(id).then((post) => {
    if (post.id === Number(id)) {
      req.post = post;
      next();
    } else {
      res.status(404).send({ FATAL: 'POST DOES NOT EXIST' });
    }
  });
}

module.exports = router;
