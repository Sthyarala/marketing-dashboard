'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import CampaignsTable from '@/components/CampaignsTable';
import LeadsTable from '@/components/LeadsTable';
import SalesTable from '@/components/SalesTable';
import RoiTable from '@/components/RoiTable';
import UploadCsv from '@/components/UploadCsv';

type Tab = 'campaigns' | 'leads' | 'sales' | 'roi' | 'upload';

export default function DashboardPage() {
  const { user, setUser } = useUser();
  const [tab, setTab] = useState<Tab>('campaigns');

  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return <div>Please select a user first</div>;

  const handleUpload = () => {
    // bump key so tables refetch
    setRefreshKey(k => k + 1);
    setTab('campaigns'); // optional UX: jump back after upload
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button
          onClick={() => setUser(null)}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#f5f5f5',
          }}
        >
          Switch User ({user.name})
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        {(['campaigns', 'leads', 'sales', 'roi', 'upload'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ marginRight: 10, fontWeight: tab === t ? 'bold' : 'normal' }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'campaigns' && (
        <CampaignsTable
          key={refreshKey}
          brandId={user.brandId}
          companyId={user.companyId}
        />
      )}

      {tab === 'leads' && (
        <LeadsTable
          key={refreshKey}
          brandId={user.brandId}
          companyId={user.companyId}
        />
      )}

      {tab === 'sales' && (
        <SalesTable
          key={refreshKey}
          brandId={user.brandId}
          companyId={user.companyId}
        />
      )}

      {tab === 'roi' && (
        <RoiTable
          key={refreshKey}
          brandId={user.brandId}
          companyId={user.companyId}
        />
      )}

      {tab === 'upload' && (
        <UploadCsv onUpload={handleUpload} />
      )}
    </div>
  );
}
