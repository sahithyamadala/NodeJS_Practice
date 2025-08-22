// const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

const userpath = path.join(__dirname, '..', 'model', 'users.json');

const registeruser = async (req, res) => {
    const { user, pass } = req.body;
    if (!user || !pass) {
        return res.status(400).json({
            "message": "username and password are required"
        });
    }
    
    const existingUsers = fs.readFileSync(userpath, 'utf-8');
    const users = JSON.parse(existingUsers);
    const duplicate = users.find(u => u.username === user);
    if (duplicate) {
        return res.status(400).json({
            "message": "Username already exists"
        });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(pass, 10);
        const newUser = {
            "username": user,
            "password": hashedPassword
        };
        fs.writeFileSync(userpath, JSON.stringify([...users, newUser], null, 2));
        res.status(201).json({
            "message": "User registered successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            "message": "Internal server error"
        });
    }
};

module.exports = {
    registeruser
};