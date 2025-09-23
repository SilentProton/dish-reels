const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodpartner.model')
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

async function logoutUser(req,res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully",
    });
}

async function registerFoodPartner (req,res) {
    const { fullName, email, password, contactName, phone, address } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "Food Partner already exists"
        })
    }

    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    if (!password || typeof password !== 'string') {
        return res.status(400).json({ message: "Password must be a string" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
        contactName,
        address
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token)

    res.status(200).json({
        message: "Food Partner registered successfully",
        user: {
            _id: foodPartner._id,
            email: foodPartner.email,
            fullName: foodPartner.fullName,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName
        }
    })
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner) {
        return res.status(400).json({
            message: "Invaliid email or passWord"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invlid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,

    },process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Food Partner logged in successfully",
        user: {
            _id: foodPartner._id,
            email: foodPartner.email,
            fullName: foodPartner.fullName
        }
    })
}

function logoutFoodPartner(req,res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food Partner logged out successfully",
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}