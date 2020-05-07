// code away!
const server = require('./server');
const port = 8000;

server.listen(port, () => {
  console.log(`\n* Server Running on Port: ${port} *\n`);
});
