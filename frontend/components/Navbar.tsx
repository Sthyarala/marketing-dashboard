'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const dashboardTabs = [
  { name: 'Campaigns', href: '/dashboard?tab=campaigns' },
  { name: 'Leads', href: '/dashboard?tab=leads' },
  { name: 'Sales', href: '/dashboard?tab=sales' },
  { name: 'ROI', href: '/dashboard?tab=roi' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <strong>Marketing Dashboard</strong>

        {dashboardTabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            style={{
              textDecoration: 'none',
              fontWeight: pathname.startsWith('/dashboard') ? 600 : 400,
            }}
          >
            {tab.name}
          </Link>
        ))}

        <span style={{ marginLeft: 'auto' }} />

        {/* CSV Upload tab is separate */}
        <Link
          href="/admin/upload"
          style={{
            textDecoration: 'none',
            fontWeight: pathname.startsWith('/admin/upload') ? 600 : 400,
          }}
        >
          Upload CSV
        </Link>
      </div>
    </nav>
  );
}
