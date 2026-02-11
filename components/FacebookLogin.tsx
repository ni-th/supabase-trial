'use client';
import { supabase } from '../lib/supabaseClient';

export default function FacebookLogin() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
    if (error) console.error('Login error:', error.message);
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Login with Facebook
    </button>
  );
}
