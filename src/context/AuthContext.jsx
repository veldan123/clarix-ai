import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('clarix_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const isDemo = email === 'demo@clarixaisupport.com' && password === 'password123';
    const hasAccount = localStorage.getItem('clarix_accounts_' + email);

    if (!isDemo && !hasAccount) return false;

    const userData = {
      id: 'usr_demo',
      name: isDemo ? 'Demo User' : JSON.parse(hasAccount).name,
      email,
      plan: 'growth',
      avatar: isDemo ? 'DU' : JSON.parse(hasAccount).avatar,
      businessName: isDemo ? 'Acme Corp' : JSON.parse(hasAccount).businessName,
    };
    setUser(userData);
    localStorage.setItem('clarix_user', JSON.stringify(userData));
    return true;
  };

  const signup = (businessName, email, password) => {
    const avatar = (businessName.split(' ').map(w => w[0]).join('').slice(0, 2)).toUpperCase();
    const userData = {
      id: 'usr_' + Math.random().toString(36).slice(2, 9),
      name: businessName,
      email,
      plan: 'starter',
      avatar,
      businessName,
    };
    localStorage.setItem('clarix_accounts_' + email, JSON.stringify({ name: businessName, avatar, businessName }));
    setUser(userData);
    localStorage.setItem('clarix_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clarix_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('clarix_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
