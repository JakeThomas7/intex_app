import Movie from '../types/Movie';

const API_URL = 'https://api2.byjacobthomas.com';
// const API_URL = 'https://localhost:5000';
export const getItemHybridRecommender = async (
  showId: string
): Promise<Movie[]> => {
  const response = await fetch(
    `${API_URL}/Recommender/ItemHybrid?id=${encodeURIComponent(showId)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get Item Hybrid Recommender');
  }

  const data = await response.json();
  return data;
};

export const getItemContentRecommender = async (
  showId: string
): Promise<Movie[]> => {
  const response = await fetch(
    `${API_URL}/Recommender/ItemContent?id=${encodeURIComponent(showId)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get Item Content Recommender');
  }

  const data = await response.json();
  return data;
};

export const getSimilarUserRecommender = async (
  userId: number
): Promise<Movie[]> => {
  const response = await fetch(
    `${API_URL}/Recommender/SimilarUser?id=${encodeURIComponent(userId)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get Similar User Recommender');
  }

  const data = await response.json();
  return data;
};

export const getUserDemographicRecommender = async (
  userId: number
): Promise<Movie[]> => {
  const response = await fetch(
    `${API_URL}/Recommender/UserDemographic?id=${encodeURIComponent(userId)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get User Demographic Recommender');
  }

  const data = await response.json();
  return data;
};

export const getUserTopRatedMovies = async (
  userId: number
): Promise<Movie[]> => {
  const response = await fetch(
    `${API_URL}/Recommender/UserTopRated?id=${encodeURIComponent(userId)}`, // you’ll add this backend route below
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get user’s top-rated movies');
  }

  return await response.json();
};

export const getTopTrendingNow = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_URL}/Recommender/TopTrendingNow`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top trending movies:', error);
    return [];
  }
};
