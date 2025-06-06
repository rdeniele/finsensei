import React, { useState } from 'react';
import ChatModal from './ChatModal';
import { Account, Transaction } from '@/lib/api';

interface CoachButtonProps {
  accounts: Account[];
  transactions: Transaction[];
}

const CoachButton: React.FC<CoachButtonProps> = ({ accounts, transactions }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Chat with Financial Advisor
      </button>
      {showModal && (
        <ChatModal
          onClose={() => setShowModal(false)}
          accounts={accounts}
          transactions={transactions}
        />
      )}
    </>
  );
};

export default CoachButton;