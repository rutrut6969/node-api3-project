// Add endpoints to retrieve the list of posts for a user and to store a new post for a user.

const express = require('express');
const users = require('./userDb');
const posts = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // Create a new User:
  const newUser = req.body;
  console.log(newUser);

  // res.status(500);
  users
    .insert(newUser)
    .then((user) => {
      user
        ? res.status(201).send({ USER: 'CREATED SUCCESSFULLY' })
        : res.status(500).send({ USER: 'COULD NOT BE CREATED' });
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ FAILURE: 'DATA UNRETRIEVABLE' });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // Create a post for the user:
  const newPost = { ...req.body, user_id: req.params.id };
  posts
    .insert(newPost)
    .then((post) => {
      post
        ? res.status(201).send({ POST: 'CREATED SUCCESSFULLY' })
        : res.status(404).send({ USER: 'NOT FOUND' });
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ FAILURE: 'DATA UNRETRIEVABLE' });
    });
  // posts.insert(req.body);
});

router.get('/', (req, res) => {
  // Retrieve List of Users:
  users
    .get(req.body)
    .then((users) => {
      users
        ? res.status(200).send(users)
        : res.status(404).send({ USERS: 'DO NOT EXIST' });
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ FAILURE: 'DATA UNRETREIVABLE' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // Retrieve a user by their ID:
  users
    .getById(req.params.id)
    .then((user) => {
      user
        ? res.status(200).send(user)
        : res.status(404).send({ USER: 'DOES NOT EXIST' });
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ FATAL: 'DATA NOT RETRIEVABLE' });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // Retrieve a list of posts for this user:
  users
    .getUserPosts(req.params.id)
    .then((posts) => {
      posts
        ? res.status(200).send(posts)
        : res.status(404).send({ USER: 'DOES NOT EXIST' });
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ FATAL: 'DATA NOT RETRIEVABLE' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // Delete a User:
  users.remove(req.params.id).then((number) => {
    res.status(204).json({ DELETED: `# OF USERS DELETED: ${number}` });
  });
});

router.put('/:id', validateUserId, (req, res) => {
  // Update a user:
  users.update(req.params.id, req.body).then((updates) => {
    updates
      ? res.status(200).json({ USERSUPDATED: `${updates}` })
      : res.status(404).send({ message: 'USER DOES NOT EXIST' });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // Validate User ID:
  const paramsID = req.params.id;
  console.log(paramsID);
  users.getById(paramsID).then((user) => {
    console.log(user.id);
    if (user.id !== Number(paramsID)) {
      res.status(400).send({ message: 'Invalid User ID' });
    } else {
      req.user = user;
      next();
    }
  });
}

function validateUser(req, res, next) {
  // Validate User:
  const data = req.body;
  if (!data) {
    res.status(400).send({ FATAL: 'MISSING USER DATA' });
  } else if (!data.name) {
    res.status(400).send({ FATAL: 'MISSING NAME' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // Validate a Post:
  const data = req.body;
  if (!data) {
    res.status(400).send({ FATAL: 'MISSING POST DATA' });
  } else if (!data.text) {
    res.status(400).send({ FATAL: 'MISSING TEXT OF POST' });
  } else {
    next();
  }
}

module.exports = router;
