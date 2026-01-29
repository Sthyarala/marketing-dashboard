'use client';

import { useEffect, useState } from 'react';

interface Sale {
  brand_name: string;
  company_name: string;
  location_id: string;
  email: string;
  product_category: string;
  revenue: number;
  quantity: number;
  date: string;
}

interface Props {
  brandId: number | null;
  companyId: number | null;
}

export default function SalesTable({ brandId, companyId }: Props) {
  const [data, setData] = useState<Sale[]>([]);

  useEffect(() => {
    if (!brandId && !companyId) return;

    const params = new URLSearchParams();
    if (brandId) params.append('brandId', brandId.toString());
    if (companyId) params.append('companyId', companyId.toString());

    fetch(`http://localhost:5000/dashboard/sales?${params.toString()}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Error fetching sales:', err));
  }, [brandId, companyId]);

  return (
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Company</th>
          <th>Location</th>
          <th>email</th>
          <th>Product</th>
          <th>Revenue</th>
          <th>Quantity</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s, idx) => (
          <tr key={idx}>
            <td>{s.brand_name}</td>
            <td>{s.company_name}</td>
            <td>{s.location_id}</td>
            <td>{s.email}</td>
            <td>{s.product_category}</td>
            <td>{s.revenue}</td>
            <td>{s.quantity}</td>
            <td>{new Date(s.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
