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
        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <span className="text-lg">🤖</span>
        <span>Talk with FinSensei AI Coach</span>
      </button>
      {showModal && (
        <ChatModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          accounts={accounts}
          transactions={transactions}
        />
      )}
    </>
  );
};

export default CoachButton;