const express = require('express');

const server = express();

const usersRouter = require('./users/userRouter');
const postsRouter = require('./posts/postRouter');

server.use(express.json());
server.use('/api/users', logger, usersRouter);
server.use('/api/posts', logger, postsRouter);

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  // request method, request url, and a timestamp
  const today = Date.now();
  console.log(
    `Method: ${req.method}, URL: ${req.baseurl}${req.url}, Time: [${today}]`
  );
  next();
}

module.exports = server;
