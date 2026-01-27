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
        cam.campaign_name,
        cam.channel,
        cam.spend,
        cam.clicks,
        cam.conversions,
        cam.date
      FROM campaigns cam
      JOIN locations l ON cam.location_id = l.id
      JOIN companies c ON l.company_id = c.id
      JOIN brands b ON c.brand_id = b.id
    `;

    const conditions: string[] = [];
    const params: number[] = [];

    if (companyId) {
      params.push(Number(companyId));
      conditions.push(`c.id = $${params.length}`);
    } else if (brandId) {
      params.push(Number(brandId));
      conditions.push(`b.id = $${params.length}`);
    }

    if (conditions.length) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY cam.date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Campaigns fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch campaigns' });
  }
});

export default router;
