const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(bodyParser.json()); // To parse JSON request bodies

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; // Fallback if .env missing

// In-memory user store (replace with DB later)
const users = [];

// ==============================
// 1. REGISTER NEW USER
// ==============================
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = users.find(u => u.username === username);
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    users.push({ username, password: hashedPassword });

    res.json({ msg: "User registered successfully" });
});

// ==============================
// 2. LOGIN AND RETURN JWT
// ==============================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Create token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// ==============================
// 3. MIDDLEWARE TO VERIFY TOKEN
// ==============================
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) return res.status(401).json({ msg: "Token not provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        res.status(403).json({ msg: "Invalid or expired token" });
    }
}
// This is middleware
// function checkToken(req, res, next) {
//     const token = req.headers.authorization;
//     if (!token) return res.status(401).send("No token");
//     next(); // pass to next handler
// }

// // This is the protected route
// app.get("/profile", checkToken, (req, res) => {
//     res.send("Access granted");
// });

// ==============================
// 4. PROTECTED ROUTE
// ==============================
app.get("/profile", authenticateToken, (req, res) => {
    res.json({ msg: `Hello ${req.user.username}, this is your profile.` });
});

// ==============================
// 5. START SERVER
// ==============================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
