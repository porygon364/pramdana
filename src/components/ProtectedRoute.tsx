import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasAccountType, setHasAccountType] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          setIsAuthenticated(true);
          
          // Check if user has selected an account type
          const { data: userAccount, error: accountError } = await supabase
            .from('user_accounts')
            .select('account_type')
            .eq('user_id', session.user.id)
            .single();

          if (accountError) throw accountError;
          
          setHasAccountType(!!userAccount?.account_type);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but no account type selected, redirect to account type selection
  if (hasAccountType === false) {
    return <Navigate to="/account-type" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 