require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const notFoundMiddleWare = require('./middleware/not-found');
const errorMiddleWare = require('./middleware/error-handler');

app.use(express.json());

app.get('/', (req, res) =>
  res.send('<h1>store api</h1><a href="/api/v1/products">products route</a>')
);

const productsRouter = require('./routes/products');
app.use('/api/v1/products', productsRouter);

const connectDb = require('./db/connect');

app.use(notFoundMiddleWare);
app.use(errorMiddleWare);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, console.log(`server listening port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
