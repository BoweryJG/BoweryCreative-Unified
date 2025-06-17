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
      console.log('Frontend: Initial session check:', { session, error });
      if (session?.user) {
        const userWithRoles = session.user as User;
        setUser(userWithRoles);
        console.log('Frontend: User set:', userWithRoles);
        
        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userWithRoles.id)
          .eq('role', 'admin')
          .single();
        
        const adminStatus = !!roleData && !roleError;
        console.log('Frontend: Admin check:', { roleData, roleError, adminStatus });
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
          
          console.log('Frontend: Client check:', { clientData, clientError });
          if (clientData && !clientError) {
            clientStatus = true;
            clientDataResult = clientData;
          }
        }
        
        setIsAuthorizedClient(clientStatus);
        setClientData(clientDataResult);
        
        // Set overall access - admin OR authorized client
        const overallAccess = adminStatus || clientStatus;
        console.log('Frontend: Access granted:', { adminStatus, clientStatus, overallAccess });
        setHasAccess(overallAccess);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthorizedClient(false);
        setClientData(null);
        setHasAccess(false);
        console.log('Frontend: No session found');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('Frontend: Auth state changed:', event, session);
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
        console.log('Frontend: Auth change - Admin check:', { roleData, roleError, adminStatus });
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
          
          console.log('Frontend: Auth change - Client check:', { clientData, clientError });
          if (clientData && !clientError) {
            clientStatus = true;
            clientDataResult = clientData;
          }
        }
        
        setIsAuthorizedClient(clientStatus);
        setClientData(clientDataResult);
        
        // Set overall access - admin OR authorized client
        const overallAccess = adminStatus || clientStatus;
        console.log('Frontend: Auth change - Access granted:', { adminStatus, clientStatus, overallAccess });
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
    console.log('Frontend: Attempting to sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Frontend: Sign in result:', { data, error });
    if (error) {
      console.error('Frontend: Sign in error:', error);
      throw error;
    }
    console.log('Frontend: Sign in successful, session:', data.session);
  };

  const signInWithGoogle = async () => {
    // Use production URL in production, current location in development
    const redirectUrl = import.meta.env.PROD 
      ? 'https://start.bowerycreativeagency.com/'
      : `${window.location.protocol}//${window.location.host}/`;
    console.log('Frontend: OAuth redirect URL:', redirectUrl);
    
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