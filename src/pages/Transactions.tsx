import React from 'react';
import { useAccount } from '@/contexts/AccountContext';
import TransactionInput from '@/components/transactions/TransactionInput';
import FamilyMembers from '@/components/family/FamilyMembers';
import BusinessLedger from '@/components/business/BusinessLedger';

const Transactions = () => {
  const { accountType } = useAccount();

  if (!accountType) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {accountType === 'personal' && (
        <TransactionInput />
      )}

      {accountType === 'family' && (
        <FamilyMembers />
      )}

      {accountType === 'business' && (
        <BusinessLedger />
      )}
    </div>
  );
};

export default Transactions; 