const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:8080', // Vite port
    credentials: true
}));

app.use(cookieParser());

// Use express.json() for all routes except the Stripe webhook
app.use((req, res, next) => {
    if (req.originalUrl === '/api/checkout/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// Import Routes
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const checkoutRoutes = require('./routes/checkout');
const economyRoutes = require('./routes/economy');

app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/economy', economyRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket Server for Real-Time Presence
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ server });

// Map of gameId -> set of connected clients
const gameRooms = new Map();

wss.on('connection', (ws, req) => {
    // Extract gameId from url query, e.g. /?gameId=123
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const gameId = urlParams.get('gameId');

    if (gameId) {
        if (!gameRooms.has(gameId)) {
            gameRooms.set(gameId, new Set());
        }
        gameRooms.get(gameId).add(ws);
        
        ws.gameId = gameId; // store on socket for cleanup
    }

    ws.on('close', () => {
        if (ws.gameId && gameRooms.has(ws.gameId)) {
            gameRooms.get(ws.gameId).delete(ws);
            if (gameRooms.get(ws.gameId).size === 0) {
                gameRooms.delete(ws.gameId);
            }
        }
    });
});

// Broadcast loop every 3 seconds
setInterval(() => {
    gameRooms.forEach((clients, gameId) => {
        const count = clients.size;
        const message = JSON.stringify({ gameId, count });
        for (let client of clients) {
            if (client.readyState === 1) { // OPEN
                client.send(message);
            }
        }
    });
}, 3000);
