const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../../models/cartModel');
const verifytoken = require('../../middleware/authMiddleware');

// Add to cart
router.post('/add', verifytoken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let cart = await Cart.findOne({ userId: userObjectId });

    if (cart) {
      const existingItem = cart.products.find(p => p.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity: quantity || 1 });
      }
      await cart.save();
      res.json({ message: 'Product added to existing cart', cart });
    } else {
      const newCart = await Cart.create({
        userId: userObjectId,
        products: [{ productId, quantity: quantity || 1 }]
      });
      res.json({ message: 'New cart created and product added', cart: newCart });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart', error });
  }
});

// Get cart
router.get('/', verifytoken, async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    // Populate product data from DB
    const cart = await Cart.findOne({ userId: userObjectId }).populate('products.productId');

    // ✅ Safely remove any product references that are null
    if (cart) {
      cart.products = cart.products.filter(p => p.productId !== null);
    }

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});


// Clear entire cart (IMPORTANT: Keep this route BEFORE the productId route)
router.delete('/clear', verifytoken, async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    const cart = await Cart.findOneAndUpdate(
      { userId: userObjectId },
      { $set: { products: [] } },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    console.log("CLEAR CART ROUTE HIT", req.userId);
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Remove specific product
router.delete('/:productId', verifytoken, async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    const productObjectId = new mongoose.Types.ObjectId(req.params.productId);

    const cart = await Cart.findOneAndUpdate(
      { userId: userObjectId },
      { $pull: { products: { productId: productObjectId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing product from cart', error: err });
  }
});

module.exports = router;
