import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type AccountType = 'personal' | 'family' | 'business';

interface AccountContextType {
  accountType: AccountType | null;
  setAccountType: (type: AccountType) => Promise<void>;
  isLoading: boolean;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [accountType, setAccountTypeState] = useState<AccountType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAccountType = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('user_accounts')
            .select('account_type')
            .eq('user_id', user.id)
            .single();
          
          if (data?.account_type) {
            setAccountTypeState(data.account_type as AccountType);
          }
        }
      } catch (error) {
        console.error('Error loading account type:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountType();
  }, []);

  const setAccountType = async (type: AccountType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_accounts')
          .upsert({
            user_id: user.id,
            account_type: type,
            updated_at: new Date().toISOString(),
          });
        
        setAccountTypeState(type);
      }
    } catch (error) {
      console.error('Error setting account type:', error);
      throw error;
    }
  };

  return (
    <AccountContext.Provider value={{ accountType, setAccountType, isLoading }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}; 