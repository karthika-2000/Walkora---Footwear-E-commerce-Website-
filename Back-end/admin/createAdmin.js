const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const db = require('../database/db'); 

db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const existingAdmin = await User.findOne({ email: 'adminwalkora@gmail.com' });

    const hashedPassword = await bcrypt.hash('123456789', 10);  // new password you want

    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('⚠️ Admin password updated:', existingAdmin.email);
      return process.exit(0);
    }

    const admin = new User({
      username: 'Admin',
      email: 'adminwalkora@gmail.com',
      mobile: '9876543210',
      address: 'Walkora Headquarters, Church street, trivandrum',
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log('Admin created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating/updating admin:', error);
    process.exit(1);
  }
});
