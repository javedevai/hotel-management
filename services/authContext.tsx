import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
         // Fetch profile
         const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
         
         if (profile) {
            setUser(profile as UserProfile);
         } else {
            // Fallback for new users who might not have a profile row yet if triggers fail
            setUser({ 
                id: session.user.id, 
                email: session.user.email!, 
                role: UserRole.GUEST 
            });
         }
      }
      setLoading(false);
    };

    checkSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setUser(profile ? (profile as UserProfile) : { id: session.user.id, email: session.user.email!, role: UserRole.GUEST });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const redirectUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000'
      : 'https://quetta-hotel-management.netlify.app';
      
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: { full_name: fullName },
            emailRedirectTo: redirectUrl
        }
    });

    if (authError) return { error: authError };

    // Check if email confirmation is required
    if (authData.user && !authData.session) {
        return { error: { message: 'Please check your email to confirm your account' } };
    }

    if (authData.user) {
        // Create profile manually if trigger doesn't exist
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: email,
            full_name: fullName,
            role: 'guest'
        }, { onConflict: 'id' });
        
        if (profileError) console.error('Profile creation error:', profileError);
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
