const express = require('express');
const router = express.Router();
const Order = require('../../models/ordersModel');
const verifytoken = require('../../middleware/authMiddleware');

router.post('/place', verifytoken, async (req, res) => {
  try {
    const { products, totalAmount, address } = req.body;

    const formattedProducts = products.map(p => ({
      productId: p.productId,
      quantity: p.quantity || 1  
    }));

    const order = await Order.create({
      userId: req.userId,
      products: formattedProducts,
      totalAmount,
      address
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error });
  }
});


router.get('/', verifytoken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('products.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});


module.exports = router;
