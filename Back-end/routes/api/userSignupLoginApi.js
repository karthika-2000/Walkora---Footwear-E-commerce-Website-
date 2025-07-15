const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');


router.post('/signupapi', async(req, res)=>{
    const {username, email, mobile, address, password, confirmPassword} = req.body;

    if(!username || !email || !mobile || !address || !password || !confirmPassword){
        return res.status(400).json({message : 'All fields are required'})
    }

    if(password !== confirmPassword){
        return res.status(400).json({message: 'Password and Confirm Password do not match'})
    }

    if(!/^[6-9]\d{9}$/.test(mobile)){
        return res.status(400).json({message: 'Invalid mobile number'});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: 'User already exist'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = await User.create({
            username,
            email,
            mobile,
            address,
            password: hashedPassword
        });
        res.status(201).json({message: 'User registered successfully', userId: newuser._id})
    } catch (err){
        res.status(500).json({message: 'server error', error: err.message})
    }
});

router.post('/loginapi', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      address: user.address
    };

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});



module.exports = router;