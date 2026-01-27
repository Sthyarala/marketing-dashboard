'use client';

import { useUser } from '@/context/UserContext';

export default function UserSwitcher() {
  const { users, setUser, loading } = useUser();

  if (loading) return <div>Loading users...</div>;
  if (!users.length) return <div>No users found</div>;

  return (
    <div>
      <h2>Select a user:</h2>
      {users.map(u => (
        <button
          key={u.id}
          onClick={() => setUser(u)}
          style={{ display: 'block', marginBottom: 10 }}
        >
          {u.name} ({u.role})
        </button>
      ))}
    </div>
  );
}
