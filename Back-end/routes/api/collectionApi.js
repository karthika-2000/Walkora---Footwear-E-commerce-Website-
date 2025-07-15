const express = require('express');
const router = express.Router();
const Product = require('../../models/productsModel');
const verifytoken = require('../../middleware/authMiddleware');

// Get all collections (if needed for admin panel)
router.get('/', verifytoken, async (req, res) => {
  try {
    const collections = await Product.distinct('gender');
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections', error });
  }
});

// Get one product per gender for Landing Page
router.get('/landing', async (req, res) => {
  try {
    const genders = await Product.distinct('gender');
    const result = [];

    for (const gender of genders) {
      const product = await Product.findOne({ gender });
      if (product) {
        result.push({ gender, product });
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching landing collections', error });
  }
});

// Get all products by gender (for All Products page)
router.get('/:genderName', verifytoken, async (req, res) => {
  try {
    const gender = req.params.genderName;
    const result = await Product.find({ gender });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

module.exports = router;
