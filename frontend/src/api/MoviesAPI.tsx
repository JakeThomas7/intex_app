import Genre from "../types/Genre";
import Movie from "../types/Movie";

const API_URL = 'https://api2.byjacobthomas.com';
// const API_URL = 'https://localhost:5000';

interface MovieParams {
    pageNum?: number;
    pageSize?: number;
    search?: string;
    categories?: string[]; // Changed from "genre" to match your frontend
}

export const fetchMovies = async (params: MovieParams): Promise<any> => {
    // Convert parameters to URL query string
    const queryParams = new URLSearchParams();
    
    if (params.pageNum) queryParams.append('pageNum', params.pageNum.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.search) queryParams.append('search', params.search);
    
    // Handle array of categories
    if (params.categories) {
        params.categories.forEach(category => {
            queryParams.append('genre', category); // Use "genre" to match your backend
        });
    }

    const url = `${API_URL}/Movies/GetMovies?${queryParams.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }
    
    return response.json();
}

export const fetchMovieById = async (movieId: string | undefined): Promise<Movie> => {
    if (!movieId) {
        throw new Error('Movie ID is required');
    }

    const response = await fetch(`${API_URL}/Movies/GetMovie/${movieId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch movie');
    }

    return response.json();
}


export const createMovie = async (newMovie: Movie): Promise<void> => {

    

    let moviePayload = {
        ...newMovie,
        genreIds: newMovie.genres ? newMovie.genres.map((genre: Genre) => genre.genreId) : []
    }
    console.log(moviePayload)

    const response = await fetch(`${API_URL}/Movies/CreateMovie`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(moviePayload)
    });

    if (!response.ok) {
        throw new Error('Failed to add movie');
    }
}

export const fetchGenres = async (): Promise<Genre[]> => {

    const response = await fetch(`${API_URL}/Movies/GetGenres`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch genres');
    }
    
    return response.json();
    
}

export const updateMovie = async (movieId: string | undefined, updatedMovie: Movie): Promise<void> => {
    
    if (!movieId) {
        throw new Error('Movie ID is required');
    }
    let moviePayload = {
        ...updatedMovie,
        genreIds: updatedMovie.genres ? updatedMovie.genres.map((genre: Genre) => genre.genreId) : []
    }

    const response = await fetch(`${API_URL}/Movies/UpdateMovie/${movieId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(moviePayload)
    });  

    if (!response.ok) {
        throw new Error('Failed to update movie');
    }
}

export const deleteMovie = async (movieId: string | undefined): Promise<void> => {
    if (!movieId) {
        throw new Error('Movie ID is required');
    }    
    const response = await fetch(`${API_URL}/Movies/DeleteMovie/${movieId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to delete movie');
    }
}