const express = require('express');
const router = express.Router();
const Products = require('../../models/productsModel');
const verifytoken = require('../../middleware/authMiddleware');
const mongoose = require('mongoose');

// Get all products (with pagination)
router.get('/all', verifytoken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const products = await Products.find().skip(skip).limit(limit);
    const total = await Products.countDocuments();

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Filter products
router.post('/filter', verifytoken, async (req, res) => {
  try {
    const { collection, price, brand, material, category, gender, product_type, page = 1, limit = 9 } = req.body;
    const query = {};

    if (collection?.length) {
      query.collection = { $in: collection.map(item => new RegExp(`^${item}$`, 'i')) };
    }
    if (brand?.length) {
      query.brand = { $in: brand.map(item => new RegExp(`^${item}$`, 'i')) };
    }
    if (material?.length) {
      query.material = { $in: material.map(item => new RegExp(`^${item}$`, 'i')) };
    }
    if (category?.length) {
      query.category = { $in: category.map(item => new RegExp(`^${item}$`, 'i')) };
    }
    if (gender?.length) {
      query.gender = { $in: gender.map(item => new RegExp(`^${item}$`, 'i')) };
    }
    if (product_type?.length) {
      query.product_type = { $in: product_type.map(item => new RegExp(`^${item}$`, 'i')) };
    }
    if (price?.length === 2) {
      const [min, max] = price;
      query.price = { $gte: min, $lte: max };
    }

    const skip = (page - 1) * limit;
    const filteredProducts = await Products.find(query).skip(skip).limit(limit);
    const total = await Products.countDocuments(query);

    res.json({
      products: filteredProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error filtering products', error });
  }
});


// Search products
router.get('/search', verifytoken, async (req, res) => {
  const query = req.query.q;
  const gender = req.query.gender;

  try {
    let searchCriteria = {};

    if (gender) {
      searchCriteria.gender = { $regex: `^${gender}$`, $options: 'i' };
    } else if (query) {
      searchCriteria = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { gender: { $regex: `^${query}$`, $options: 'i' } },
        ]
      };
    } else {
      return res.status(400).json({ message: 'Search term missing' });
    }

    const result = await Products.find(searchCriteria);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err });
  }
});

// Get single product by ID (View Product API)
router.get('/:id', verifytoken, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Products.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

module.exports = router;
