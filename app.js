const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require("compression");
const helmet = require("helmet");

const connectionString = require("./public/javascripts/connection");

const indexRouter = require('./routes/index');
const catalogRouter = require("./routes/catalog");

const app = express();

// Set up rate limiter: maximum of twenty requests per minute (this stops brute force attacks)
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
app.use(limiter)

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url = connectionString;
const mongoDB = process.env.MONGODB_URI || dev_db_url

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup - this sets our views to the view engine Pug (formally Jade)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Various dependencies
app.use(compression()); // For compressed server errors (see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Critical for security. It sets HTTP headers to protect from (well-known) web vulnerabilities.
// See https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment
// In the template pug folder we included some bootstrap and jQuery scripts, so we have to pass these in (note that normally we would
// have these as dependencies, so this wouldn't be a problem, so we have to mark this up here. This shouldn't be done normally as it 
// goes against helmet's policy of external scripts).
// More on Helmet: https://www.npmjs.com/package/helmet
app.use(helmet.contentSecurityPolicy({
  directives: {
    "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
  },
}));

// Set public/ to a static directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
