import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    organization_id?: string;
    role?: string;
  };
  roles?: string[];
}

interface ClientData {
  organization_name: string;
  subscription_level: string;
  subscription_features: any;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthorizedClient: boolean;
  hasAccess: boolean;
  clientData: ClientData | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isAuthorizedClient: false,
  hasAccess: false,
  clientData: null,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorizedClient, setIsAuthorizedClient] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(async ({ data: { session }, error }: any) => {
      console.log('Initial session check:', { session, error });
      if (session?.user) {
        const userWithRoles = session.user as User;
        setUser(userWithRoles);
        console.log('User set:', userWithRoles);
        
        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userWithRoles.id)
          .eq('role', 'admin')
          .single();
        
        const adminStatus = !!roleData && !roleError;
        console.log('Admin check:', { roleData, roleError, adminStatus });
        setIsAdmin(adminStatus);
        
        // Check if user is authorized client (only if not admin)
        let clientStatus = false;
        let clientDataResult = null;
        
        if (!adminStatus) {
          const { data: clientData, error: clientError } = await supabase
            .from('authorized_clients')
            .select('*')
            .eq('user_id', userWithRoles.id)
            .eq('is_active', true)
            .single();
          
          console.log('Client check:', { clientData, clientError });
          if (clientData && !clientError) {
            clientStatus = true;
            clientDataResult = clientData;
          }
        }
        
        setIsAuthorizedClient(clientStatus);
        setClientData(clientDataResult);
        
        // Set overall access - admin OR authorized client
        const overallAccess = adminStatus || clientStatus;
        console.log('Access granted:', { adminStatus, clientStatus, overallAccess });
        setHasAccess(overallAccess);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorizedClient(false);
        setClientData(null);
        setHasAccess(false);
        console.log('No session found');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('Auth state changed:', event, session);
      if (session?.user) {
        const userWithRoles = session.user as User;
        setUser(userWithRoles);
        
        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userWithRoles.id)
          .eq('role', 'admin')
          .single();
        
        const adminStatus = !!roleData && !roleError;
        console.log('Auth change - Admin check:', { roleData, roleError, adminStatus });
        setIsAdmin(adminStatus);
        
        // Check if user is authorized client (only if not admin)
        let clientStatus = false;
        let clientDataResult = null;
        
        if (!adminStatus) {
          const { data: clientData, error: clientError } = await supabase
            .from('authorized_clients')
            .select('*')
            .eq('user_id', userWithRoles.id)
            .eq('is_active', true)
            .single();
          
          console.log('Auth change - Client check:', { clientData, clientError });
          if (clientData && !clientError) {
            clientStatus = true;
            clientDataResult = clientData;
          }
        }
        
        setIsAuthorizedClient(clientStatus);
        setClientData(clientDataResult);
        
        // Set overall access - admin OR authorized client
        const overallAccess = adminStatus || clientStatus;
        console.log('Auth change - Access granted:', { adminStatus, clientStatus, overallAccess });
        setHasAccess(overallAccess);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorizedClient(false);
        setClientData(null);
        setHasAccess(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Sign in result:', { data, error });
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    console.log('Sign in successful, session:', data.session);
  };

  const signInWithGoogle = async () => {
    // Use production URL in production, current location in development
    const redirectUrl = import.meta.env.PROD 
      ? 'https://bowerycreative-dashboard.netlify.app/'
      : `${window.location.protocol}//${window.location.host}/`;
    console.log('OAuth redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isAuthorizedClient, hasAccess, clientData, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};