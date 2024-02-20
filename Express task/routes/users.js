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

        if (await User.findOne({ username: req.body.username })) {
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
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            res.status(400).json({ error: error.message });
        } else {
            // Other types of errors
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
        return res.status(404).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ 
                username: user.username, role: user.role 
            }, process.env.JWT_SECRET,
            { expiresIn: '1h' } // token expires in 1 hour
            );
            res.status(200).json({
                accessToken: accessToken,
            });
        } else {
            // unauthorized
            res.status(401).json({ message: 'Incorrect password.' });
        }
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;
