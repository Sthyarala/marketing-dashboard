'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface AppUser {
  id: number;
  name: string;
  role: string;
  brandId: number | null;
  companyId: number | null;
}

interface UserContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  users: AppUser[];
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  users: [],
  loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from backend
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then((data: AppUser[]) => {
        setUsers(data);
      })
      .catch(err => console.error('Failed to fetch users:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, users, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
