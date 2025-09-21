const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: "Password must be a string" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token)

    res.status(200).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
        }
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user) {
        return res.status(400).json({
            message: "Invaliid email or passWord"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invlid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,

    },process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "user logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}

module.exports = {
    registerUser,
    loginUser,
}