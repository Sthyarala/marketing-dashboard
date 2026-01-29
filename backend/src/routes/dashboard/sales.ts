import express from 'express';
import { pool } from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { brandId, companyId } = req.query;

    let query = `
      SELECT
        b.name AS brand_name,
        c.name AS company_name,
        l.external_id AS location_id,
        s.email,
        s.product_category,
        s.revenue,
        s.quantity,
        s.date
      FROM sales s
      JOIN locations l ON s.location_id = l.id
      JOIN companies c ON l.company_id = c.id
      JOIN brands b ON c.brand_id = b.id
    `;

    const conditions: string[] = [];
    const params: (number | string)[] = [];

    if (companyId) {
      params.push(Number(companyId));
      conditions.push(`c.id = $${params.length}`);
    } else if (brandId) {
      params.push(Number(brandId));
      conditions.push(`b.id = $${params.length}`);
    }

    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ' ORDER BY s.date DESC';

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('Sales fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch sales' });
  }
});

export default router;
