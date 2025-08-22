const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const fspromises = require('fs').promises;  


const userpath = path.join(__dirname, '..', 'model', 'users.json');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: "Username and password are required" });

    try {
        const existingUsers = await fspromises.readFile(userpath, 'utf-8');
        const users = JSON.parse(existingUsers);
        const foundUser = users.find(person => person.username === user);

        if (!foundUser) return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) {
            res.status(401).json({ message: "Invalid credentials" });
        } else {
            const accessToken = jwt.sign({ username: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken=jwt.sign({username:user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'7d'});
            // Update the user's refresh token in the users array  
            // Remove the current user from the list and add it back with the new refresh token
            // const users = JSON.parse(existingUsers);
            // if (!users || !Array.isArray(users)) {
            //     return res.status(500).json({ message: "User data is corrupted" });
            // }
            // // Filter out the current user and add them back with the new refresh token 
            // const userIndex = users.findIndex(person => person.username === user);  
            // if (userIndex === -1) {
            //     return res.status(404).json({ message: "User not found" });
            // }  
            // // Create a new array without the current user  
            // const currentUser = { ...users[userIndex], refreshToken };
            const otherUsers = users.filter(person => person.username !== user);
            const currentUser = { username: user, password: foundUser.password, refreshToken };
            // Save the updated users list with the new refresh token
            await fspromises.writeFile(userpath, JSON.stringify([...otherUsers, currentUser], null, 2));        
            // Set the refresh token in an HTTP-only cookie     
            // res.cookie('jwt', refreshToken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            //     sameSite: 'Strict',
            //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            // });
            res.cookie(jwt,refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:'Strict',
                maxAge:7*24*60*60*1000//7 days
            })
            res.status(200).json({ message: `User ${user} logged in successfully`, accessToken, refreshToken });
        }
    } catch (error) {
        console.error("Error reading users file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { handleLogin };