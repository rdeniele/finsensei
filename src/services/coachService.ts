import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Advice } from '@/types/coach';

export const fetchFinancialAdvice = async (): Promise<Advice | null> => {
  const token = getToken();
  if (!token) {
    console.error('No authentication token found');
    return null;
  }

  try {
    const response = await api.getFinancialAdvice(token);
    if (!response.ok) {
      throw new Error('Failed to fetch financial advice');
    }
    const adviceData: Advice = await response.json();
    return adviceData;
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    return null;
  }
};