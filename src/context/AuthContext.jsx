import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

function avatarFromName(name) {
  return (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(buildUser(session.user));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? buildUser(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function buildUser(supabaseUser) {
    const meta = supabaseUser.user_metadata || {};
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      businessName: meta.businessName || meta.email || supabaseUser.email,
      avatar: meta.avatar || avatarFromName(meta.businessName || supabaseUser.email),
      plan: meta.plan || 'starter',
    };
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, message: error.message };
    setUser(buildUser(data.user));
    return { ok: true };
  };

  const signup = async (businessName, email, password) => {
    const avatar = avatarFromName(businessName);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { businessName, avatar, plan: 'starter' } },
    });
    if (error) return { ok: false, message: error.message };
    if (data.user) setUser(buildUser(data.user));
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updates) => {
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (!error && data.user) setUser(buildUser(data.user));
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
