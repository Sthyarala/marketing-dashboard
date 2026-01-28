import express from 'express';
import multer from 'multer';
import { pool } from '../../db';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const client = await pool.connect();
  try {
    const data = fs.readFileSync(req.file.path, 'utf-8');
    const lines = data.split('\n').slice(1); // skip header

    await client.query('BEGIN');

    for (const line of lines) {
      if (!line.trim()) continue;

      const [
        brandName,
        companyName,
        locationExternalId,
        productCategory,
        revenue,
        quantity,
        date
      ] = line.split(',');

      // Brand
      const brandResult = await client.query(
        `
        INSERT INTO brands (name)
        VALUES ($1)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
        `,
        [brandName]
      );
      const brandId = brandResult.rows[0].id;

      // Company (MUST match composite constraint)
      const companyResult = await client.query(
        `
        INSERT INTO companies (name, brand_id)
        VALUES ($1, $2)
        ON CONFLICT (name, brand_id)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING id
        `,
        [companyName, brandId]
      );
      const companyId = companyResult.rows[0].id;

      // Location (ensure name is NOT NULL)
      const locationResult = await client.query(
        `
        INSERT INTO locations (external_id, name, company_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (external_id)
        DO UPDATE SET company_id = EXCLUDED.company_id
        RETURNING id
        `,
        [locationExternalId, locationExternalId, companyId]
      );
      const locationId = locationResult.rows[0].id;

      // Insert sale
      await client.query(
        `
        INSERT INTO sales
          (location_id, product_category, revenue, quantity, date)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (location_id, product_category, date)
        DO UPDATE SET
          revenue = EXCLUDED.revenue,
          quantity = EXCLUDED.quantity
        `,
        [
          locationId,
          productCategory,
          parseFloat(revenue),
          parseInt(quantity),
          date
        ]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Sales CSV uploaded successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Sales upload error:', error);
    res.status(500).json({ message: 'Error processing sales CSV' });
  } finally {
    client.release();
    fs.unlinkSync(req.file.path);
  }
});

export default router;
