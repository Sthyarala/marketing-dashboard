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

  try {
    const data = fs.readFileSync(req.file.path, 'utf-8');
    const lines = data.split('\n').slice(1); // skip CSV header

    for (const line of lines) {
      if (!line.trim()) continue;

      const [
        brandName,
        companyName,
        locationExternalId,
        campaignName,
        channel,
        spend,
        clicks,
        conversions,
        dateStr
      ] = line.split(',').map(v => v.trim());

      /* ------------------ Brand ------------------ */
      const brandResult = await pool.query(
        `
        INSERT INTO brands (name)
        VALUES ($1)
        ON CONFLICT (name)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING id
        `,
        [brandName]
      );
      const brandId = brandResult.rows[0].id;

      /* ------------------ Company ------------------ */
      const companyResult = await pool.query(
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

      /* ------------------ Location ------------------ */
      const locationResult = await pool.query(
        `
        INSERT INTO locations (external_id, name, company_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (external_id)
        DO UPDATE SET company_id = EXCLUDED.company_id
        RETURNING id
        `,
        [
          locationExternalId,
          locationExternalId,
          companyId
        ]
      );
      const locationId = locationResult.rows[0].id;

      /* ------------------ Campaign ------------------ */
      // CSV is MM/DD/YYYY → Postgres wants YYYY-MM-DD
      const parsedDate = new Date(dateStr);

      await pool.query(
        `
        INSERT INTO campaigns (
          location_id,
          campaign_name,
          channel,
          spend,
          clicks,
          conversions,
          date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (location_id, campaign_name, channel, date)
        DO UPDATE SET
          spend = EXCLUDED.spend,
          clicks = EXCLUDED.clicks,
          conversions = EXCLUDED.conversions
        `,
        [
          locationId,
          campaignName,
          channel,
          Number(spend),
          Number(clicks),
          Number(conversions),
          parsedDate
        ]
      );
    }

    res.json({ message: 'Campaigns CSV uploaded successfully' });
  } catch (error) {
    console.error('Campaigns upload error:', error);
    res.status(500).json({ message: 'Error processing campaigns CSV' });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

export default router;
