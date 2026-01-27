import express from 'express';
import { pool } from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { brandId, companyId } = req.query;

    let query = `
      SELECT
        c.name AS company_name,
        COALESCE(SUM(cam.spend), 0) AS total_spend,
        COALESCE(SUM(s.revenue), 0) AS total_revenue,
        COALESCE(SUM(s.revenue), 0) - COALESCE(SUM(cam.spend), 0) AS roi
      FROM companies c
      JOIN brands b ON c.brand_id = b.id
      LEFT JOIN locations l ON l.company_id = c.id
      LEFT JOIN campaigns cam ON cam.location_id = l.id
      LEFT JOIN sales s ON s.location_id = l.id
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
    query += ' GROUP BY c.name ORDER BY roi DESC';

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('ROI fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch ROI report' });
  }
});

export default router;
