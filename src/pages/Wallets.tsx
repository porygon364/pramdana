import React from 'react';
import { useAccount } from '@/contexts/AccountContext';
import WalletManager from '@/components/wallets/WalletManager';

const Wallets = () => {
  const { accountType } = useAccount();

  if (!accountType) return null;

  return (
    <div className="space-y-6">
      <WalletManager />
    </div>
  );
};

export default Wallets; 