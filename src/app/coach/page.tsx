import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFinancialAdvice } from '@/lib/gemini';
import CoachModal from '@/components/FinancialCoach/CoachModal';
import CoachButton from '@/components/FinancialCoach/CoachButton';

export default function CoachPage() {
  const [showModal, setShowModal] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const adviceData = await fetchFinancialAdvice();
      setAdvice(adviceData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching financial advice:', error);
      alert('Failed to fetch advice. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Financial Coach</h1>
      <CoachButton onClick={handleGetAdvice} loading={loading} />
      {showModal && (
        <CoachModal onClose={() => setShowModal(false)} advice={advice} />
      )}
    </div>
  );
}