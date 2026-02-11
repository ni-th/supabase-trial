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
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);

        // Insert into profiles table if it doesn't exist
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id);

        if (!data?.length) {
          await supabase.from('profiles').insert({
            id: session.user.id,
            full_name: session.user.user_metadata.full_name || session.user.email,
            email: session.user.email,
            avatar_url: session.user.user_metadata.avatar_url || null,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {user ? (
        <>
          <h1 className="text-2xl">Welcome, {user.user_metadata.full_name || user.email}</h1>
          {user.user_metadata.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full" />
          )}
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
