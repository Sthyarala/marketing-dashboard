// src/routes/users.ts
import express from 'express';
import { pool } from '../db';

const router = express.Router();

// GET /users - returns all users (for testing/demo)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username AS name, role, brand_id AS "brandId", company_id AS "companyId"
      FROM users
      ORDER BY username
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


export default router;
