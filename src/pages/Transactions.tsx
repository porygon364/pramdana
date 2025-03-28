import React from 'react';
import { useAccount } from '@/contexts/AccountContext';
import TransactionInput from '@/components/transactions/TransactionInput';
import TransactionHistory from '@/components/transactions/TransactionHistory';
import FamilyMembers from '@/components/family/FamilyMembers';
import BusinessLedger from '@/components/business/BusinessLedger';

const Transactions = () => {
  const { accountType } = useAccount();

  if (!accountType) return null;

  return (
    <div className="space-y-6">
      {accountType === 'personal' && (
        <>
          <TransactionInput onSuccess={() => {
            // Trigger a refresh of the transaction history
            const event = new CustomEvent('transactionAdded');
            window.dispatchEvent(event);
          }} />
          <TransactionHistory />
        </>
      )}
      
      {accountType === 'family' && <FamilyMembers />}
      
      {accountType === 'business' && <BusinessLedger />}
    </div>
  );
};

export default Transactions; 