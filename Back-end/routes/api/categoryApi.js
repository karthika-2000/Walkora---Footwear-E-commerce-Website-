const express = require('express');
const products = require('../../models/productsModel');
const router = express.Router();
const verifytoken = require('../../middleware/authMiddleware');

// Get distinct category names
router.get('/categories', async (req, res) => {
  try {
    const categories = await products.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// Get one product per distinct category for Landing Page
router.get('/categories/landing', async (req, res) => {
  try {
    const categories = await products.distinct('category');
    const result = [];

    for (const cat of categories) {
      const product = await products.findOne({ category: cat });
      if (product) {
        result.push({ category: cat, product });
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching landing categories', error });
  }
});

// Get products by category (for All Products page)
router.get('/category/:categoryName', verifytoken, async (req, res) => {
  try {
    const { categoryName } = req.params;
    const prodcuts = await products.find({ category: categoryName });
    res.json(prodcuts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

module.exports = router;
