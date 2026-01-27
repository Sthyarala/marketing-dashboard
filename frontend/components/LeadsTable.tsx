'use client';

import { useEffect, useState } from 'react';

interface Lead {
  brand_name: string;
  company_name: string;
  location_id: string;
  name: string;
  email: string;
  lead_source: string;
  status: string;
  date: string;
}

interface Props {
  brandId: number | null;
  companyId: number | null;
}

export default function LeadsTable({ brandId, companyId }: Props) {
  const [data, setData] = useState<Lead[]>([]);

  useEffect(() => {
    if (!brandId && !companyId) return;

    const params = new URLSearchParams();
    if (brandId) params.append('brandId', brandId.toString());
    if (companyId) params.append('companyId', companyId.toString());

    fetch(`http://localhost:5000/dashboard/leads?${params.toString()}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error fetching leads:', err));
  }, [brandId, companyId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Company</th>
          <th>Location</th>
          <th>Name</th>
          <th>Email</th>
          <th>Source</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((l, idx) => (
          <tr key={idx}>
            <td>{l.brand_name}</td>
            <td>{l.company_name}</td>
            <td>{l.location_id}</td>
            <td>{l.name}</td>
            <td>{l.email}</td>
            <td>{l.lead_source}</td>
            <td>{l.status}</td>
            <td>{new Date(l.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
