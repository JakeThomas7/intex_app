import Recommender from '../types/Recommender';

const API_URL = 'https://api2.byjacobthomas.com';
export const getItemHybridRecommender = async (): Promise<Recommender> => {
  const response = await fetch(`${API_URL}/Recommender/ItemHybrid`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get Item Hybrid Recommender');
  }

  const data = await response.json();

  return data;
};
