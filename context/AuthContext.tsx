import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type UserData = {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  // Computed properties
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  session: Session | null;
  user: UserData | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    console.log('Fetching user data for ID:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user data:', error.message);
      return;
    }

    if (data) {
      console.log('User data fetched successfully:', data);
      // Split full_name into firstName and lastName
      const nameParts = (data.full_name || '').split(' ');
      const userData: UserData = {
        ...data,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      };
      console.log('Processed user data:', userData);
      setUser(userData);
    } else {
      console.log('No user data found');
    }
  };

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
  }: SignUpData) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
        },
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in...');
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error.message);
      throw error;
    }

    if (!authData.session) {
      throw new Error('No session returned after sign in');
    }

    console.log('Sign in successful, setting session...');
    setSession(authData.session);

    if (authData.session.user) {
      console.log('Fetching user data for ID:', authData.session.user.id);
      await fetchUserData(authData.session.user.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
