'use client';

import { useUser } from '@/context/UserContext';
import UserSwitcher from '@/components/UserSwitcher';
import DashboardPage from '@/app/dashboard/page';

export default function HomePage() {
  const { user } = useUser();

  return (
    <div>
      {!user && <UserSwitcher />}
      {user && <DashboardPage />}
    </div>
  );
}

