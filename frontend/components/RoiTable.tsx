'use client';

import { useEffect, useState } from 'react';

interface RoiRow {
  company_name: string;
  total_spend: number;
  total_revenue: number;
  roi: number;
}

interface Props {
  brandId: number | null;
  companyId: number | null;
}

export default function RoiTable({ brandId, companyId }: Props) {
  const [data, setData] = useState<RoiRow[]>([]);

  useEffect(() => {
    if (!brandId && !companyId) return;

    const params = new URLSearchParams();
    if (brandId) params.append('brandId', brandId.toString());
    if (companyId) params.append('companyId', companyId.toString());

    fetch(`http://localhost:5000/dashboard/roi?${params.toString()}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error fetching ROI:', err));
  }, [brandId, companyId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>Total Spend</th>
          <th>Total Revenue</th>
          <th>ROI</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, idx) => (
          <tr key={idx}>
            <td>{r.company_name}</td>
            <td>{r.total_spend}</td>
            <td>{r.total_revenue}</td>
            <td>{r.roi}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
