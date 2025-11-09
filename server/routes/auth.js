const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-gen-z';

// Fort Knox Rate Limiter (5 attempts / 15 mins)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Register
router.post('/register', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const hash = await argon2.hash(password);
        db.run(`INSERT INTO Users (username, password) VALUES (?, ?)`, [username, hash], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (err) {
        res.status(500).json({ error: 'Hashing error' });
    }
});

// Login
router.post('/login', loginLimiter, (req, res) => {
    const { username, password, rememberMe } = req.body;

    db.get(`SELECT * FROM Users WHERE username = ?`, [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        try {
            const isMatch = await argon2.verify(user.password, password);
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            // Remember Me logic
            const expiresIn = rememberMe ? '30d' : '1h';
            const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 3600000;

            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge
            });

            res.json({ message: 'Logged in successfully', user: { id: user.id, username: user.username } });
        } catch (err) {
            res.status(500).json({ error: 'Error checking password' });
        }
    });
});

// Restore Session (GET /me)
router.get('/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Fetch licenses for the user
        db.all(`SELECT gameId FROM Licenses WHERE userId = ?`, [decoded.id], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error fetching licenses' });
            
            const purchasedGames = rows.map(r => String(r.gameId));
            res.json({ 
                user: { 
                    id: decoded.id, 
                    username: decoded.username,
                    purchasedGames 
                } 
            });
        });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Generate Magic Link
router.post('/magic-link/generate', loginLimiter, (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });

    db.get(`SELECT * FROM Users WHERE username = ?`, [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate token
        const rawToken = crypto.randomBytes(32).toString('hex');
        
        try {
            const tokenHash = await argon2.hash(rawToken);
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
            
            db.run(`INSERT INTO MagicLinks (username, token_hash, expires_at) VALUES (?, ?, ?)`, 
                [username, tokenHash, expiresAt], 
                function(err) {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    
                    const link = `http://localhost:8080/magic-login?token=${rawToken}&user=${username}`;
                    console.log('MAGIC LINK GENERATED (MOCK EMAIL):', link);
                    
                    res.json({ message: 'Magic link sent', mockLink: link });
                }
            );
        } catch (hashErr) {
            res.status(500).json({ error: 'Hashing error' });
        }
    });
});

// Consume Magic Link
router.post('/magic-link/consume', async (req, res) => {
    const { token, username } = req.body;
    if (!token || !username) return res.status(400).json({ error: 'Invalid magic link' });

    db.get(`SELECT * FROM MagicLinks WHERE username = ? ORDER BY id DESC LIMIT 1`, [username], async (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(400).json({ error: 'Invalid or expired link' });

        // Check expiration
        if (new Date(row.expires_at) < new Date()) {
            return res.status(400).json({ error: 'Magic link expired' });
        }

        try {
            const isValid = await argon2.verify(row.token_hash, token);
            if (!isValid) return res.status(400).json({ error: 'Invalid magic link' });

            // Issue JWT
            db.get(`SELECT * FROM Users WHERE username = ?`, [username], (err, user) => {
                if (err || !user) return res.status(500).json({ error: 'User lookup failed' });
                
                const sessionToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

                res.cookie('token', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 3600000
                });

                // Invalidate link
                db.run(`DELETE FROM MagicLinks WHERE id = ?`, [row.id]);
                
                res.json({ message: 'Logged in via Magic Link', user: { id: user.id, username: user.username } });
            });
        } catch (verifyErr) {
            res.status(500).json({ error: 'Error validating token' });
        }
    });
});

// Mock OAuth Login
router.post('/oauth/mock', async (req, res) => {
    const { provider } = req.body; // 'PS', 'XB', or 'EPIC'
    if (!['PS', 'XB', 'EPIC'].includes(provider)) {
        return res.status(400).json({ error: 'Invalid OAuth provider' });
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const mockUsername = `${provider}_Gamer_${randomId}`;
    
    // We generate a long, highly secure random password for this mock user
    const mockPassword = crypto.randomBytes(32).toString('hex');
    
    try {
        const hash = await argon2.hash(mockPassword);
        db.run(`INSERT INTO Users (username, password) VALUES (?, ?)`, [mockUsername, hash], function(err) {
            if (err && !err.message.includes('UNIQUE')) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            // Generate Session Token
            db.get(`SELECT * FROM Users WHERE username = ?`, [mockUsername], (err, user) => {
                if (err || !user) return res.status(500).json({ error: 'User lookup failed' });

                const sessionToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

                res.cookie('token', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days for OAuth default
                });

                res.json({ message: 'OAuth login successful', user: { id: user.id, username: user.username } });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'OAuth setup error' });
    }
});

module.exports = router;
