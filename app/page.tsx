'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import FacebookLogin from '../components/FacebookLogin';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {user ? (
        <>
          <h1 className="text-2xl">Welcome, {user.email}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl">Please login</h1>
          <FacebookLogin />
        </>
      )}
    </div>
  );
}
