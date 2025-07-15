var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./admin/routes/index');

// API routers
var apiRouter = require('./routes/api/userSignupLoginApi');
var categoryApi = require('./routes/api/categoryApi');
var collectionApi = require('./routes/api/collectionApi');
var allProductsApi = require('./routes/api/allProductsApi');
var ordersApi = require('./routes/api/ordersApi');
var cartApi = require('./routes/api/cartApi');
var userProfileApi = require('./routes/api/userProfileApi');
const productRoutes = require('./admin/routes/products');

var expressLayouts = require('express-ejs-layouts');
const db = require('./database/db');
const authMiddleware = require('./middleware/authMiddleware');

var app = express();

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Parsers and logger
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files for admin panel
app.use(express.static(path.join(__dirname, 'admin', 'public')));

// Session setup (keep for admin login later)
app.use(session({
  secret: 'adminsecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Skip layout for API
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    req.isApi = true;
    res.locals.layout = false;
  }
  next();
});

// Set EJS and layout
app.set('views', path.join(__dirname, 'admin', 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout-admin');

// Auth middleware for protected APIs only
app.use((req, res, next) => {
  const isPublic =
    req.path.startsWith('/api/signupapi') ||
    req.path.startsWith('/api/loginapi') ||
    req.path.startsWith('/api/cat/categories') ||
    req.path.startsWith('/api/trending');

  if (isPublic) return next();
  if (!req.originalUrl.startsWith('/api')) return next();

  return authMiddleware(req, res, next);
});

// Admin EJS routes
app.use('/', indexRouter);
app.use('/products', productRoutes);

// APIs
app.use('/api', apiRouter);
app.use('/api/cat', categoryApi);
app.use('/api/trending', collectionApi);
app.use('/api/products', allProductsApi);
app.use('/api/cart', cartApi);
app.use('/api/orders', ordersApi);
app.use('/api/profile', userProfileApi);

// Handle API 404
app.use(function (req, res, next) {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      error: req.app.get('env') === 'development' ? err : {}
    });
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send(`
    <h1>Error ${err.status || 500}</h1>
    <p>${err.message}</p>
    <a href="/">Go Back to Home</a>
  `);
});

module.exports = app;
