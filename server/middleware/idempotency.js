// Mock Redis store using a Node.js Map
const idempotencyStore = new Map();

// Cleanup old keys every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of idempotencyStore.entries()) {
        if (now - value.timestamp > 5 * 60 * 1000) {
            idempotencyStore.delete(key);
        }
    }
}, 60 * 1000);

const idempotencyMiddleware = (req, res, next) => {
    // Only apply to POST requests
    if (req.method !== 'POST') return next();

    const idempotencyKey = req.headers['x-idempotency-key'];
    
    if (!idempotencyKey) {
        return res.status(400).json({ error: 'X-Idempotency-Key header is required for this endpoint.' });
    }

    const cachedData = idempotencyStore.get(idempotencyKey);

    if (cachedData) {
        if (cachedData.status === 'PENDING') {
            return res.status(409).json({ error: 'Transaction is already processing.' });
        }
        if (cachedData.status === 'COMPLETED') {
            // Return cached response instantly
            return res.status(cachedData.statusCode || 200).json(cachedData.response);
        }
    }

    // Set as PENDING
    idempotencyStore.set(idempotencyKey, {
        status: 'PENDING',
        timestamp: Date.now()
    });

    // Intercept res.json to capture the final payload
    const originalJson = res.json;
    res.json = function (body) {
        // Update the cache with COMPLETED status and payload
        idempotencyStore.set(idempotencyKey, {
            status: 'COMPLETED',
            timestamp: Date.now(),
            response: body,
            statusCode: res.statusCode
        });
        
        // Call the original res.json
        originalJson.call(this, body);
    };

    next();
};

module.exports = idempotencyMiddleware;
