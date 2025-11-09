const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'gameverse.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS Games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                price REAL,
                category TEXT,
                image TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Licenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                gameId INTEGER,
                purchaseDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(userId) REFERENCES Users(id),
                FOREIGN KEY(gameId) REFERENCES Games(id)
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS Bundles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                discountPercentage REAL
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS BundleGames (
                bundleId INTEGER,
                gameId INTEGER,
                FOREIGN KEY(bundleId) REFERENCES Bundles(id),
                FOREIGN KEY(gameId) REFERENCES Games(id),
                PRIMARY KEY (bundleId, gameId)
            )`);

            // Seed Mock Bundle Data
            db.run(`INSERT OR IGNORE INTO Bundles (id, title, discountPercentage) VALUES (1, 'Cyberpunk Starter Pack', 20)`);
            db.run(`INSERT OR IGNORE INTO BundleGames (bundleId, gameId) VALUES (1, 1), (1, 2)`);

            // Phase 14: Passwordless Future Pass
            db.run(`CREATE TABLE IF NOT EXISTS MagicLinks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                token_hash TEXT,
                expires_at DATETIME
            )`);

            // Phase 19: Backend Economy
            db.run(`CREATE TABLE IF NOT EXISTS DLCs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                parentGameId INTEGER,
                title TEXT,
                description TEXT,
                price REAL,
                image TEXT,
                FOREIGN KEY(parentGameId) REFERENCES Games(id)
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS Transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                totalAmount REAL,
                transactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT,
                FOREIGN KEY(userId) REFERENCES Users(id)
            )`);

            // Seed Mock DLC Data
            db.run(`INSERT OR IGNORE INTO DLCs (id, parentGameId, title, description, price, image) VALUES (1, 1, 'Cyber Neon 2077 - Phantom Liberty', 'A massive expansion introducing a new spy-thriller storyline.', 29.99, 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?auto=format&fit=crop&w=800&q=80')`);
            db.run(`INSERT OR IGNORE INTO DLCs (id, parentGameId, title, description, price, image) VALUES (2, 2, 'Star Command - Outer Rim', 'Explore uncharted territories with 5 new playable factions.', 19.99, 'https://images.unsplash.com/photo-1541873676577-078c18751ce3?auto=format&fit=crop&w=800&q=80')`);
        });
    }
});

module.exports = db;
