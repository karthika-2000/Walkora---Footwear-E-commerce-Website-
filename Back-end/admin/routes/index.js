const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Products = require('../../models/productsModel');
const User = require('../../models/userModel');
const Order = require('../../models/ordersModel');

// Middleware to protect admin routes
function adminAuth(req, res, next) {
  if (!req.session.adminId) {
    return res.redirect('/adminlogin');
  }
  next();
}

// GET Admin Login Page
router.get('/adminlogin', (req, res) => {
  const error = req.session.error;
  req.session.error = null;
  res.render('adminloginpg', { layout: 'layouts/layout-login', error });
});

// POST Admin Login
router.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });
    if (!admin || !admin.isAdmin) {
      req.session.error = 'Invalid email or not an admin';
      return res.redirect('/adminlogin');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      req.session.error = 'Incorrect password';
      return res.redirect('/adminlogin');
    }

    req.session.adminId = admin._id;
    res.redirect('/adminlanding');
  } catch (err) {
    console.error('Login error:', err);
    req.session.error = 'Something went wrong';
    res.redirect('/adminlogin');
  }
});

//  Admin Dashboard
router.get('/adminlanding', adminAuth, (req, res) => {
  res.render('adminlandingpg', { title: 'Admin Dashboard' });
});

// View All Products (with pagination + search)
router.get('/allproducts', adminAuth, async (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;

  try {
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    };

    const totalProducts = await Products.countDocuments(search ? query : {});
    const products = await Products.find(search ? query : {})
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render('viewallproducts', {
      title: 'All Products',
      products,
      search,
      totalPages: Math.ceil(totalProducts / perPage),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.redirect('/adminlanding');
  }
});

//  View All Registered Users (with pagination + search)
router.get('/registeredusers', adminAuth, async (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;

  try {
    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render('registereduserspg', {
      title: 'Registered Users',
      users,
      search,
      totalPages: Math.ceil(totalUsers / perPage),
      currentPage: page
    });
  } catch (err) {
    console.error('User fetch error:', err);
    res.redirect('/adminlanding');
  }
});

// View All Orders (with pagination + search)
router.get('/orders/viewallorders', adminAuth, async (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;

  try {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;

    let query = {};
    if (search) {
      query.$or = [
        ...(objectIdPattern.test(search) ? [{ _id: search }] : []),
        ...(objectIdPattern.test(search) ? [{ userId: search }] : []),
        { status: { $regex: search, $options: 'i' } }
      ];
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('userId', 'username address')
      .populate('products.productId', 'title')
      .sort({ orderedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.render('viewallorderspg', {
      title: 'View All Orders',
      orders,
      search,
      totalPages: Math.ceil(totalOrders / perPage),
      currentPage: page
    });
  } catch (err) {
    console.error('Order fetch error:', err);
    res.redirect('/adminlanding');
  }
});

// Update Order Status
router.post('/orders/update-status/:id', adminAuth, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    await Order.findByIdAndUpdate(orderId, { status });
    res.redirect('/orders/viewallorders');
  } catch (err) {
    console.error('Update failed:', err);
    res.redirect('/orders/viewallorders');
  }
});

// Delete Order
router.post('/orders/delete/:id', adminAuth, async (req, res) => {
  const orderId = req.params.id;

  try {
    await Order.findByIdAndDelete(orderId);
    res.redirect('/orders/viewallorders');
  } catch (err) {
    console.error('Order delete failed:', err);
    res.redirect('/orders/viewallorders');
  }
});


// Logout
router.get('/adminlogout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/adminlogin');
  });
});


module.exports = router;