import express from 'express';
import { pool } from '../../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { brandId, companyId } = req.query;

    const conditions: string[] = [];
    const params: (number | string)[] = [];

    if (companyId) {
      params.push(Number(companyId));
      conditions.push(`c.id = $${params.length}`);
    } else if (brandId) {
      params.push(Number(brandId));
      conditions.push(`b.id = $${params.length}`);
    }

    const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        c.name AS company_name,
        COALESCE(cam_totals.total_spend, 0) AS total_spend,
        COALESCE(sales_totals.total_revenue, 0) AS total_revenue,
        COALESCE(sales_totals.total_revenue, 0) - COALESCE(cam_totals.total_spend, 0) AS roi
      FROM companies c
      JOIN brands b ON c.brand_id = b.id
      LEFT JOIN (
        SELECT l.company_id, SUM(cam.spend) AS total_spend
        FROM campaigns cam
        JOIN locations l ON cam.location_id = l.id
        GROUP BY l.company_id
      ) cam_totals ON cam_totals.company_id = c.id
      LEFT JOIN (
        SELECT l.company_id, SUM(s.revenue) AS total_revenue
        FROM sales s
        JOIN locations l ON s.location_id = l.id
        GROUP BY l.company_id
      ) sales_totals ON sales_totals.company_id = c.id
      ${whereClause}
      ORDER BY roi DESC
    `;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('ROI fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch ROI report' });
  }
});

export default router;
