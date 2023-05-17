const dotenv = require('dotenv'); //1

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!😒😒😒😒 Shutting down.....');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' }); // 2

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection succes'));

// .catch((err) => console.log('ERROR'));

// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(process.env.NODE_ENV);
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!😒😒😒😒 Shutting down.....');
  console.log(err.name, err.message);

  // process.exit(1); instead of this
  server.close(() => {
    process.exit(1);
  });
});
