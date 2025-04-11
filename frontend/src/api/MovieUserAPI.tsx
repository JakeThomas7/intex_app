import MovieUser from '../types/MovieUser';

const API_URL = 'https://api2.byjacobthomas.com';
//const API_URL = 'https://localhost:5000';

export const addMovieUser = async (movieUser: MovieUser) => {
  console.log(movieUser);
  console.log(JSON.stringify(movieUser));

  const response = await fetch(`${API_URL}/MovieUser/UpsertMovieUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(movieUser),
  });

  if (!response.ok) {
    console.log(response.json());
    throw new Error('Failed to add movie user');
  }
};
