import Headline from '../types/Headline';
import Traffic from '../types/Traffic';

// const API_URL = 'https://localhost:5000';
const API_URL = 'https://api2.byjacobthomas.com';

export const fetchHeadlines = async (): Promise<Headline[]> => {
  // const categoryParams = selectedCategories
  //     .map((cat) => `categories=${encodeURIComponent(cat)}`)
  //     .join('&');

  const response = await fetch(`${API_URL}/Headline/GetHeadlines`);

  if (!response.ok) {
    throw new Error('Failed to get headlines');
  }

  const data = await response.json();

  return data;
};

export const createHeadline = async (
  newHeadline: Headline
): Promise<Headline> => {
  const response = await fetch(`${API_URL}/Headline/CreateHeadline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newHeadline),
  });

  if (!response.ok) {
    throw new Error('Failed to add headline');
  }

  const data = await response.json();
  return data;
};

export const updateHeadline = async (
  headlineID: number,
  updatedHeadline: Headline
): Promise<Headline> => {
  const response = await fetch(
    `${API_URL}/Headline/UpdateHeadline/${headlineID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedHeadline),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update headline');
  }
  const data = await response.json();
  return data;
};

export const deleteHeadline = async (headlineID: number): Promise<void> => {
  try {
    await fetch(`${API_URL}/Headline/DeleteHeadline/${headlineID}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
export const getSiteTraffic = async (): Promise<Traffic[]> => {
  const response = await fetch(`${API_URL}/Traffic/GetTraffic`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get site traffic');
  }

  const data = await response.json();

  return data;
};

export const recordSiteTraffic = async (fingerprint: string): Promise<void> => {
  const response = await fetch(`${API_URL}/Traffic/AddTraffic/${fingerprint}`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to record site traffic');
  }
};
