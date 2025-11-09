const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-gen-z';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Failed to authenticate token" });
        req.userId = decoded.id;
        next();
    });
};

// GET /api/economy/bundles - Fetch available bundles
router.get('/bundles', (req, res) => {
    db.all(`
        SELECT b.id, b.title, b.discountPercentage,
               GROUP_CONCAT(g.id) as gameIds,
               SUM(g.price) as originalPrice
        FROM Bundles b
        JOIN BundleGames bg ON b.id = bg.bundleId
        JOIN Games g ON bg.gameId = g.id
        GROUP BY b.id
    `, [], (err, bundles) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Calculate discounted price
        const formattedBundles = bundles.map(b => ({
            id: b.id,
            title: b.title,
            discountPercentage: b.discountPercentage,
            gameIds: b.gameIds.split(',').map(Number),
            originalPrice: b.originalPrice,
            discountedPrice: b.originalPrice * (1 - (b.discountPercentage / 100))
        }));
        
        res.json({ bundles: formattedBundles });
    });
});

// GET /api/economy/dlc/:gameId - Fetch DLC for a game
router.get('/dlc/:gameId', (req, res) => {
    const { gameId } = req.params;
    db.all(`SELECT * FROM DLCs WHERE parentGameId = ?`, [gameId], (err, dlcs) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ dlcs });
    });
});

// GET /api/economy/licenses - Fetch all owned licenses for the current user
router.get('/licenses', verifyToken, (req, res) => {
    const userId = req.userId;
    db.all(`SELECT gameId FROM Licenses WHERE userId = ?`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const ownedGames = rows.map(r => r.gameId);
        res.json({ licenses: ownedGames });
    });
});

// POST /api/economy/checkout - Master Transaction Endpoint
router.post('/checkout', verifyToken, async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.userId;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    try {
        // Step 1: Verify user doesn't already own these games
        const existingLicenses = await new Promise((resolve, reject) => {
            db.all(`SELECT gameId FROM Licenses WHERE userId = ?`, [userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows.map(r => r.gameId));
            });
        });

        const duplicates = cartItems.filter(item => existingLicenses.includes(item.id));
        if (duplicates.length > 0) {
            return res.status(400).json({ 
                message: "Duplicate purchase detected. You already own some items in your cart.",
                duplicates: duplicates.map(d => d.title)
            });
        }

        // Step 2: Calculate total amount
        const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0);

        // Step 3: Simulate Payment Processor Delay (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 4: Grant Licenses and Record Transaction (Inside a manual transaction flow)
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            // Record transaction ledger
            db.run(`INSERT INTO Transactions (userId, totalAmount, status) VALUES (?, ?, 'COMPLETED')`, [userId, totalAmount], function(err) {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }
                const transactionId = this.lastID;

                // Grant licenses
                const stmt = db.prepare(`INSERT INTO Licenses (userId, gameId) VALUES (?, ?)`);
                cartItems.forEach(item => {
                    stmt.run([userId, item.id]);
                });
                stmt.finalize();

                db.run("COMMIT", (commitErr) => {
                    if (commitErr) {
                        return res.status(500).json({ error: "Failed to finalize transaction" });
                    }
                    res.json({ 
                        message: "Checkout successful. Licenses granted.",
                        transactionId,
                        totalAmount
                    });
                });
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error during checkout" });
    }
});

module.exports = router;
