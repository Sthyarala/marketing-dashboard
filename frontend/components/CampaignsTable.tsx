'use client';

import { useEffect, useState } from 'react';

interface Campaign {
  brand_name: string;
  company_name: string;
  location_id: string;
  campaign_name: string;
  channel: string;
  spend: number;
  clicks: number;
  conversions: number;
  date: string;
}

interface Props {
  brandId: number | null;
  companyId: number | null;
}

export default function CampaignsTable({ brandId, companyId }: Props) {
  const [data, setData] = useState<Campaign[]>([]);

  useEffect(() => {
    if (!brandId && !companyId) return;

    const params = new URLSearchParams();
    if (brandId) params.append('brandId', brandId.toString());
    if (companyId) params.append('companyId', companyId.toString());

    fetch(`http://localhost:5000/dashboard/campaigns?${params.toString()}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error fetching campaigns:', err));
  }, [brandId, companyId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Company</th>
          <th>Location</th>
          <th>Campaign</th>
          <th>Channel</th>
          <th>Spend</th>
          <th>Clicks</th>
          <th>Conversions</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c, idx) => (
          <tr key={idx}>
            <td>{c.brand_name}</td>
            <td>{c.company_name}</td>
            <td>{c.location_id}</td>
            <td>{c.campaign_name}</td>
            <td>{c.channel}</td>
            <td>{c.spend}</td>
            <td>{c.clicks}</td>
            <td>{c.conversions}</td>
            <td>{new Date(c.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
