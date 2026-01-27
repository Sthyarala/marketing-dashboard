import express from 'express';
import multer from 'multer';
import { pool } from '../../db';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const data = fs.readFileSync(req.file.path, 'utf-8');
    const lines = data.split('\n').slice(1); // skip CSV header

    for (const line of lines) {
      if (!line.trim()) continue;

      const [
        brandName,
        companyName,
        locationId,
        name,
        email,
        leadSource,
        status,
        date,
      ] = line.split(',');

      // Insert or update brand
      const brandResult = await pool.query(
        'INSERT INTO brands(name) VALUES($1) ON CONFLICT(name) DO UPDATE SET name=EXCLUDED.name RETURNING id',
        [brandName]
      );
      const brandId = brandResult.rows[0].id;

      // Insert or update company
      const companyResult = await pool.query(
        'INSERT INTO companies(name, brand_id) VALUES($1, $2) ON CONFLICT(name, brand_id) DO UPDATE SET name=EXCLUDED.name RETURNING id',
        [companyName, brandId]
      );
      const companyId = companyResult.rows[0].id;

      // Insert or update location (using locationId as name temporarily)
      const locationResult = await pool.query(
        `INSERT INTO locations(external_id, name, company_id)
         VALUES($1, $2, $3)
         ON CONFLICT(external_id)
         DO UPDATE SET name=EXCLUDED.name, company_id=EXCLUDED.company_id
         RETURNING id`,
        [locationId, locationId, companyId]
      );
      const locId = locationResult.rows[0].id;

      // Insert lead
      await pool.query(
        `INSERT INTO leads(location_id, name, email, lead_source, status, date)
         VALUES($1, $2, $3, $4, $5, $6)
         ON CONFLICT(location_id, email) DO NOTHING`,
        [locId, name, email, leadSource, status, date]
      );
    }

    res.json({ message: 'Leads CSV uploaded successfully' });
  } catch (error) {
    console.error('Leads upload error:', error);
    res.status(500).json({ message: 'Error processing leads CSV' });
  }
});

export default router;
