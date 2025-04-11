import { useEffect, useState } from 'react';
import Navbar from '../components/all_pages/Navbar';
import { useAuth } from '../components/context/AuthContext';
import AllMovies from '../components/shop/AllMovies';
import Carousel from '../components/shop/Carousel';
import SearchResults from '../components/shop/SearchResults';
import {
  getItemContentRecommender,
  getSimilarUserRecommender,
  getTopTrendingNow,
  getUserDemographicRecommender,
  getUserTopRatedMovies,
} from '../api/RecommenderAPI';
import Movie from '../types/Movie';
import SimpleFooter from '../components/all_pages/SimpleFooter';

interface CarouselMovie {
  title: string;
  imagePath: string;
  year: number;
  rank: number;
  showId: string;
}

const ShopPage = () => {
  const { user } = useAuth();
  console.log('User: ', user);
  const [userId, setUserId] = useState(user?.userId || null); // Assuming userId is available in the user object
  const [similarUserRecs, setSimilarUserRecs] = useState<CarouselMovie[]>([]);
  const [userDemographicRecs, setUserDemographicRecs] = useState<
    CarouselMovie[]
  >([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [contentRecsByMovie, setContentRecsByMovie] = useState<{
    [movieId: string]: CarouselMovie[];
  }>({});
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (user?.userId && user.userId < 200) {
      setUserId(user.userId);
    } else {
      setUserId(null);
    }
  }, [user]);

  console.log('User ID:', userId);

  useEffect(() => {
    const fetchSimilarUserRecs = async () => {
      if (!userId) return;

      try {
        const recs = await getSimilarUserRecommender(userId);

        const mapped = recs.map((m, idx) => ({
          title: m.title ?? 'Untitled',
          imagePath: m.image_url_suffix
            ? `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${m.image_url_suffix}`
            : 'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg',
          year: m.releaseYear ?? 0,
          rank: idx + 1,
          showId: m.showId ?? `unknown-${idx}`,
        }));

        setSimilarUserRecs(mapped);
      } catch (error) {
        console.error('Error fetching similar user recommendations:', error);
      }
    };

    fetchSimilarUserRecs();
  }, [userId]);

  useEffect(() => {
    const fetchUserDemographicRecs = async () => {
      if (!userId) return;

      try {
        const recs = await getUserDemographicRecommender(userId);

        const mapped = recs.map((m, idx) => ({
          title: m.title ?? 'Untitled',
          imagePath: m.image_url_suffix
            ? `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${m.image_url_suffix}`
            : 'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg',
          year: m.releaseYear ?? 0,
          rank: idx + 1,
          showId: m.showId ?? `unknown-${idx}`,
        }));

        setUserDemographicRecs(mapped);
      } catch (error) {
        console.error(
          'Error fetching user demographic recommendations:',
          error
        );
      }
    };

    fetchUserDemographicRecs();
  }, [userId]);

  useEffect(() => {
    const fetchTopMovieRecs = async () => {
      if (!userId) return;

      try {
        // Step 1: Get top-rated movies
        const topMovies = await getUserTopRatedMovies(userId);
        setTopRatedMovies(topMovies);
        console.log('Top movies: ', topMovies);

        // Step 2: For each movie, fetch content-based recs
        const recsByMovie: { [key: string]: CarouselMovie[] } = {};

        for (const movie of topMovies) {
          if (!movie.showId) continue;

          const recs = await getItemContentRecommender(movie.showId);

          recsByMovie[movie.showId] = recs.map((m, idx) => ({
            title: m.title ?? 'Untitled',
            imagePath: m.image_url_suffix
              ? `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${m.image_url_suffix}`
              : 'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg',
            year: m.releaseYear ?? 0,
            rank: idx + 1,
            showId: m.showId ?? `unknown-${idx}`,
          }));
        }
        console.log('recsByMovie: ', recsByMovie);
        setContentRecsByMovie(recsByMovie);
      } catch (error) {
        console.error('Error fetching top-rated movie recs:', error);
      }
    };

    fetchTopMovieRecs();
  }, [userId]);

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await getTopTrendingNow();
      setTrendingMovies(data);
    };

    fetchTrending();
  }, []);

  const [isSearching, setIsSearching] = useState(false);

  return (
    <div>
      <Navbar />
      <SearchResults
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
      {!isSearching && (
        <div className="flex-grow">
          {userId && (
            <div>
              <Carousel
                title="Users with similar tastes also liked:"
                cardWidth={22}
                cardHeight={32}
                data={similarUserRecs}
              />
              <Carousel
                title="Popular in your age group:"
                cardWidth={22}
                cardHeight={32}
                data={userDemographicRecs}
              />
              {topRatedMovies.map((movie) =>
                movie.showId ? (
                  <Carousel
                    key={movie.showId}
                    title={`Because you liked '${movie.title}'`}
                    cardWidth={22}
                    cardHeight={32}
                    data={contentRecsByMovie[movie.showId] || []}
                  />
                ) : null
              )}
            </div>
          )}
          <Carousel
            title="Trending Now"
            cardWidth={22}
            cardHeight={32}
            data={trendingMovies}
          />
          <AllMovies />
        </div>
      )}
      <SimpleFooter />
    </div>
  );
};

export default ShopPage;
