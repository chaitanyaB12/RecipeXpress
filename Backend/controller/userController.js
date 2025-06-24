const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashPwd
        });
        let token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY);
        // Remove password before sending user object
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        return res.status(200).json({ token, user: userWithoutPassword });
    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        let user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            let token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY);
            const { password: _, ...userWithoutPassword } = user.toObject();
            return res.status(200).json({ token, user: userWithoutPassword });
        } else {
            return res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ email: user.email });
    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
};

module.exports = { userSignUp, userLogin, getUser };
