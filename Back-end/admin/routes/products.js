const express = require('express');
const router = express.Router();
const Products = require('../../models/productsModel');
const multer = require('multer');

//  Multer config (store image in memory as buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

//  GET - Add Product Form
router.get('/add', (req, res) => {
  const status = req.query.status;
  res.render('addproducts', { title: 'Add Product', status });
});

//  POST - Add Product

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { title, price, brand, category, gender, material, description } = req.body;

    // Debugging logs
    console.log("Form Data:", req.body);
    console.log("Uploaded File:", req.file);

    // Check if image file is uploaded
    if (!req.file) {
      console.error(" No image file uploaded");
      return res.redirect('/products/add?status=error');
    }

    // Check if required fields are missing
    if (!title || !price || !brand || !category || !gender || !material || !description) {
      console.error(" Missing form fields");
      return res.redirect('/products/add?status=error');
    }

    // Create new product
    const newProduct = new Products({
      title,
      price: parseFloat(price),
      brand,
      category,
      gender,
      material,
      description,
      image: req.file.buffer.toString('base64'),
      active: true,
    });

    // Save product
    await newProduct.save();
    console.log(" Product saved successfully");
    res.redirect('/products/add?status=success');

  } catch (err) {
    console.error(" Add product error FULL:", err);
    res.redirect('/products/add?status=error');
  }
});


// GET - Edit Product Page
router.get('/edit/:id', async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    res.render('editproductpg', {
      title: 'Edit Product',
      product,
      status: req.query.status,
    });
  } catch (err) {
    console.error('Edit page error:', err.message);
    res.redirect('/allproducts?status=error');
  }
});

//  POST - Update Product
router.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, price, brand, category, gender, material, description } = req.body;
    const isActive = req.body.active === 'on';

    const updateFields = {
      title,
      price,
      brand,
      category,
      gender,
      material,
      description,
      active: isActive,
    };

    if (req.file) {
      updateFields.image = req.file.buffer.toString('base64');
    }

    await Products.findByIdAndUpdate(req.params.id, updateFields);
    res.redirect(`/products/edit/${req.params.id}?status=success`);
  } catch (err) {
    console.error('Update product error:', err.message);
    res.redirect(`/products/edit/${req.params.id}?status=error`);
  }
});

// GET - View Product
router.get('/view/:id', async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.render('viewproductpg', { title: 'View Product', product });
  } catch (err) {
    console.error('View product error:', err.message);
    res.redirect('/allproducts?status=error');
  }
});

// GET - Delete Product
router.get('/delete/:id', async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    res.redirect('/allproducts?status=success');
  } catch (err) {
    console.error('Delete error:', err.message);
    res.redirect('/allproducts?status=error');
  }
});

module.exports = router;
