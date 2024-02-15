const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();
// Dummy database for users

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if(await User.findOne({ username:req.body.username })) {
        return res.status(409).json({
            message: "User already exists."
        })
    }
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role || 'regular'
    });
    await user.save();
    res.status(201).send('User created');
  } catch(err) {
    res.status(500).json({
        err: err.message
    });
  }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});

module.exports = router;
