// src/api/MoviesAPI.tsx

import Genre from '../types/Genre';
import Movie from '../types/Movie';

const API_URL = 'https://api2.byjacobthomas.com';
// const API_URL = 'https://localhost:5000';

interface MovieParams {
  pageNum?: number;
  pageSize?: number;
  search?: string;
  categories?: string[];
}

// Fetch movies with optional filters
export const fetchMovies = async (params: MovieParams): Promise<any> => {
  const queryParams = new URLSearchParams();

  if (params.pageNum) queryParams.append('pageNum', params.pageNum.toString());
  if (params.pageSize)
    queryParams.append('pageSize', params.pageSize.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.categories) {
    params.categories.forEach((category) => {
      queryParams.append('genre', category);
    });
  }

  const url = `${API_URL}/Movies/GetMovies?${queryParams.toString()}`;
  const response = await fetch(url, { method: 'GET', credentials: 'include' });

  if (!response.ok) throw new Error('Failed to fetch movies');
  return response.json();
};

// export const getMovieByShowId = async (ShowId: string): Promise<Movie> => {
//   const response = await fetch(
//     `${API_URL}/Movies/GetMovieById?ShowId=${encodeURIComponent(ShowId)}`,
//     {
//       method: 'GET',
//       credentials: 'include', // assuming you're using cookies/auth
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch movie with ShowId ${ShowId}`);
//   }

//   return await response.json();
// };

// Create movie
export const createMovie = async (newMovie: Movie): Promise<void> => {
  const moviePayload = {
    ...newMovie,
    genreIds: newMovie.genres
      ? newMovie.genres.map((genre: Genre) => genre.genreId)
      : [],
  };

  const response = await fetch(`${API_URL}/Movies/CreateMovie`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(moviePayload),
  });

  if (!response.ok) throw new Error('Failed to add movie');
};

// Update movie
export const updateMovie = async (
  movieId: string | undefined,
  updatedMovie: Movie
): Promise<void> => {
  if (!movieId) throw new Error('Movie ID is required');

  const moviePayload = {
    ...updatedMovie,
    genreIds: updatedMovie.genres
      ? updatedMovie.genres.map((genre: Genre) => genre.genreId)
      : [],
  };

  const response = await fetch(`${API_URL}/Movies/UpdateMovie/${movieId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(moviePayload),
  });

  if (!response.ok) throw new Error('Failed to update movie');
};

// Delete movie
export const deleteMovie = async (
  movieId: string | undefined
): Promise<void> => {
  if (!movieId) throw new Error('Movie ID is required');

  const response = await fetch(`${API_URL}/Movies/DeleteMovie/${movieId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to delete movie');
};

// Fetch genres
export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await fetch(`${API_URL}/Movies/GetGenres`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch genres');
  return response.json();
};

// Fetch movie details including average and user rating
export const fetchMovieDetailsWithRating = async (
  showId: string
): Promise<any> => {
  const response = await fetch(
    `${API_URL}/MovieRating/GetMovieDetailsPage/${showId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify('patrick59@gmail.com'), // Change to dynamic email later
    }
  );

  if (!response.ok)
    throw new Error('Failed to fetch movie details with rating');
  return response.json();
};

// Submit a new or updated rating
export const submitRating = async (
  userId: number,
  showId: string,
  rating: number
) => {
  const response = await fetch(`${API_URL}/MovieRating/MakeRating`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      showId: showId,
      rating,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit rating');
  }

  return response.json();
};
