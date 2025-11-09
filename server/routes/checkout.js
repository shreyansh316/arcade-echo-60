const express = require('express');
const db = require('../db');
const idempotencyMiddleware = require('../middleware/idempotency');
const router = express.Router();

// Mock Stripe Secret Key
const STRIPE_SECRET = 'sk_test_mock_123';

// Create Payment Intent (Mock)
router.post('/create-intent', idempotencyMiddleware, (req, res) => {
    const { gameIds } = req.body;
    
    if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
        return res.status(400).json({ error: 'Game IDs are required' });
    }

    // In a real scenario, query the DB for the exact prices of gameIds and sum them up
    // For this mock, we'll just simulate it.
    const sql = `SELECT id, price FROM Games WHERE id IN (${gameIds.map(() => '?').join(',')})`;
    
    db.all(sql, gameIds, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error calculating price' });
        }

        // Simulating the total price calculation
        const totalAmount = rows.reduce((sum, row) => sum + (row.price || 0), 0) * 100; // in cents
        
        // Mock Stripe Intent Response
        res.json({
            clientSecret: `pi_mock_${Date.now()}_secret_${Math.random()}`,
            amount: totalAmount,
            currency: 'usd'
        });
    });
});

// Stripe Webhook Listener (Mock)
// Note: This endpoint expects raw bodies to verify signatures in real Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    // 1. Verify Signature (Mocked here)
    // const signature = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    
    // For our mock, we just parse the body
    let event;
    try {
        event = JSON.parse(req.body.toString());
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 2. Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Mock: extract user ID and game IDs from paymentIntent metadata
        const userId = paymentIntent.metadata?.userId || 1; 
        const gameId = paymentIntent.metadata?.gameId || 1;

        // 3. Fulfill the purchase (Insert into Licenses table)
        db.run(`INSERT INTO Licenses (userId, gameId) VALUES (?, ?)`, [userId, gameId], (err) => {
            if (err) {
                console.error('Fulfillment error:', err);
                return res.status(500).end();
            }
            console.log(`Payment succeeded! License granted for game ${gameId} to user ${userId}`);
        });
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send({ received: true });
});

// Dynamic Bundle Prorating Engine (Prompt 5)
router.post('/calculate-bundle', idempotencyMiddleware, (req, res) => {
    const { userId, bundleId } = req.body;
    if (!userId || !bundleId) {
        return res.status(400).json({ error: 'User ID and Bundle ID are required' });
    }

    // 1. Fetch Bundle details & Games in the Bundle
    const bundleSql = `
        SELECT b.id, b.title, b.discountPercentage, g.id as gameId, g.price 
        FROM Bundles b
        JOIN BundleGames bg ON bg.bundleId = b.id
        JOIN Games g ON g.id = bg.gameId
        WHERE b.id = ?
    `;

    db.all(bundleSql, [bundleId], (err, bundleItems) => {
        if (err || bundleItems.length === 0) {
            return res.status(404).json({ error: 'Bundle not found' });
        }

        const discountPercentage = bundleItems[0].discountPercentage;
        
        // 2. Fetch User's Owned Games
        db.all(`SELECT gameId FROM Licenses WHERE userId = ?`, [userId], (err, ownedRows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            const ownedGameIds = new Set(ownedRows.map(r => r.gameId));
            
            let originalPrice = 0;
            let proratedPrice = 0;
            let deductedTitles = [];

            // 3. Calculation Logic
            bundleItems.forEach(item => {
                originalPrice += item.price;
                if (ownedGameIds.has(item.gameId)) {
                    deductedTitles.push(item.gameId); // User owns this, subtract from cost
                } else {
                    proratedPrice += item.price;
                }
            });

            // 4. Apply discount only to unowned games
            const savingsFromDiscount = proratedPrice * (discountPercentage / 100);
            proratedPrice = proratedPrice - savingsFromDiscount;
            
            const savingsFromOwned = originalPrice - (proratedPrice + savingsFromDiscount);

            res.json({
                originalBundlePrice: originalPrice,
                finalProratedPrice: proratedPrice,
                deductedTitles: deductedTitles,
                breakdown: {
                    savingsFromOwnedGames: savingsFromOwned,
                    savingsFromDiscount: savingsFromDiscount
                }
            });
        });
    });
});

module.exports = router;
