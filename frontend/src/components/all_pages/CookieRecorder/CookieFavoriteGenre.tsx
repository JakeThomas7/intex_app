import { useEffect } from 'react';
import Cookies from 'js-cookie';

const GENRE_HISTORY_COOKIE = 'genre_history';
const FAVORITE_GENRE_COOKIE = 'favorite_genre';
const MAX_HISTORY = 30; // Maximum genres to track

const CookieFavoriteGenre = ({ genre }: { genre?: string }) => {
  useEffect(() => {
    if (Cookies.get('cookie_consent') !== 'accepted' || !genre) return;

    // Get or initialize genre history
    const currentHistory = Cookies.get(GENRE_HISTORY_COOKIE);
    let genreHistory: string[] = currentHistory ? JSON.parse(currentHistory) : [];

    // Add new genre to history (limit to MAX_HISTORY)
    genreHistory = [genre, ...genreHistory].slice(0, MAX_HISTORY);
    Cookies.set(GENRE_HISTORY_COOKIE, JSON.stringify(genreHistory), {
      expires: 180, // 6 months
      sameSite: 'Lax'
    });

    // Calculate favorite genre
    const genreCounts = genreHistory.reduce((acc, g) => {
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteGenre = Object.entries(genreCounts).reduce(
      (max, [genre, count]) => (count > max.count ? { genre, count } : max),
      { genre: '', count: 0 }
    ).genre;

    if (favoriteGenre) {
      Cookies.set(FAVORITE_GENRE_COOKIE, favoriteGenre, {
        expires: 180,
        sameSite: 'Lax'
      });
    }

  }, [genre]);

  return null;
};

// Helper functions to access the cookies elsewhere in your app
export const getGenreHistory = (): string[] => {
  try {
    const cookie = Cookies.get(GENRE_HISTORY_COOKIE);
    return cookie ? JSON.parse(cookie) : [];
  } catch {
    return [];
  }
};

export const getFavoriteGenre = (): string | null => {
  return Cookies.get(FAVORITE_GENRE_COOKIE) || null;
};

export default CookieFavoriteGenre;