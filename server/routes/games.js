const express = require('express');
const db = require('../db');

const router = express.Router();

// Search Games (Paginated)
router.get('/search', (req, res) => {
    const { query = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT * FROM Games 
        WHERE title LIKE ? OR category LIKE ? 
        LIMIT ? OFFSET ?
    `;
    const searchString = `%${query}%`;

    db.all(sql, [searchString, searchString, limit, offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database search error' });
        }
        
        // Get total count
        db.get(`SELECT COUNT(*) as count FROM Games WHERE title LIKE ? OR category LIKE ?`, [searchString, searchString], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database count error' });
            }
            res.json({
                data: rows,
                total: row.count,
                page: parseInt(page),
                totalPages: Math.ceil(row.count / limit)
            });
        });
    });
});

module.exports = router;
