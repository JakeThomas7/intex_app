import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/all_pages/Navbar';
import Carousel from '../components/shop/Carousel';
import '../styles/DetailsPage.css';
import Movie from '../types/Movie';
import SimpleFooter from '../components/all_pages/SimpleFooter';
import {
  getItemHybridRecommender,
  getTopTrendingNow,
} from '../api/RecommenderAPI';
import { fetchMovieDetailsWithRating, submitRating } from '../api/MoviesAPI';
import CookieFavoriteGenre from '../components/all_pages/CookieRecorder/CookieFavoriteGenre';
import { useAuth } from '../components/context/AuthContext';

interface CarouselMovie {
  title: string;
  imagePath: string;
  year: number;
  rank: number;
  showId: string;
}

// ✅ Sanitize the movie title for URLs
const sanitizeTitleForURL = (title: string): string => {
  return title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '%20');
};

const DetailsPage = () => {
  const { showId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number>(1); // Default to 1
  const [recommendations, setRecommendations] = useState<CarouselMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(
    'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg'
  );

  const { user } = useAuth();
  const [userId, setUserId] = useState(user?.userId || null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!showId) return;

      try {
        const result = await fetchMovieDetailsWithRating(showId);
        setMovie(result.movie); // result should include movie + rating + genres
        setUserRating(result.userRating);
        setUserId(result.user.userId); // This might be redundant
      } catch (err) {
        console.error('❌ Error fetching movie details with rating:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [showId]);

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await getTopTrendingNow();
      setTrendingMovies(data);
    };

    fetchTrending();
  }, []);

  const handleStarClick = (value: number) => {
    setSelectedRating(value);
  };

  const handleSubmitRating = async () => {
    console.log('Submit button clicked');
    console.log('movie?.showId:', movie?.showId);
    console.log('selectedRating:', selectedRating);
    console.log('userId:', userId);

    // Check for valid data before submitting
    if (!movie?.showId || !selectedRating || userId === null) return;

    try {
      const response = await submitRating(userId, movie.showId, selectedRating);
      const data = await response.json(); // Parse the JSON response

      console.log(data.message); // Log the response message (e.g., "Rating saved successfully.")

      window.location.reload(); // This reloads the page, fetching fresh data from the backend

      // Update userRating immediately after submitting
      setUserRating(selectedRating); // This will automatically trigger re-render with updated userRating
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }

    window.location.reload(); // This reloads the page, fetching fresh data from the backend
  };

  useEffect(() => {
    if (movie?.title) {
      const sanitized = sanitizeTitleForURL(movie.title);
      const candidateUrl = `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${sanitized}.jpg`;

      const img = new Image();
      img.src = candidateUrl;
      img.onload = () => setBackgroundImageUrl(candidateUrl);
      img.onerror = () =>
        setBackgroundImageUrl(
          'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg'
        );
    }
  }, [movie?.title, showId]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!movie?.showId) return;

      try {
        const recs = await getItemHybridRecommender(movie.showId);
        const mapped = recs.map((m, idx) => ({
          title: m.title ?? 'Untitled',
          imagePath: m.image_url_suffix
            ? `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${m.image_url_suffix}`
            : 'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg',
          year: m.releaseYear ?? 0,
          rank: idx + 1,
          showId: m.showId ?? `unknown-${idx}`,
        }));
        setRecommendations(mapped);
      } catch (error) {
        console.error('Error fetching hybrid recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [movie?.showId, showId]);

  return (
    <div>
      <Navbar />
      <div
        className="details-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0.2) 70%, rgba(255, 255, 255, 0.1) 100%), url(${backgroundImageUrl})`,
        }}
      >
        <div className="details-overlay container">
          {loading ? (
            <p className="text-white">Loading movie...</p>
          ) : (
            <>
              <p className="movie-subinfo">{movie?.rating || 'N/A'}</p>
              <h1 className="movie-title">{movie?.title || 'Movie Title'}</h1>

              <div className="movie-stats d-flex align-items-center gap-3 flex-wrap mb-3">
                {/* Display user rating */}
                <span className="stat-pill d-flex align-items-center gap-2">
                  <i className="fas fa-thumbs-up me-1"></i>
                  {userRating === null ? (
                    <span className="text-white">N/A</span> // Rating not set
                  ) : (
                    <span className="text-white">{userRating}</span> // Show the user's rating
                  )}
                </span>

                {/* Average rating */}
                <span className="stat-pill">
                  <i className="fas fa-star me-1 text-warning"></i>
                  {movie?.averageRating && movie.averageRating !== 0
                    ? movie.averageRating.toFixed(1)
                    : 'N/A'}
                </span>

                {/* Release year */}
                <span className="stat-pill">
                  <i className="fas fa-calendar-alt me-1"></i>
                  {movie?.releaseYear || 'N/A'}
                </span>

                {/* Duration */}
                <span className="stat-pill">
                  <i className="fas fa-clock me-1"></i>
                  {movie?.duration || 'N/A'}
                </span>
              </div>

              <div className="genre-tags">
                {movie?.genres?.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre.genreName}
                  </span>
                ))}
              </div>

              <p className="movie-description">
                {movie?.description ||
                  'This is a brief description of the movie.'}
              </p>

              <div className="movie-actions">
                <button className="btn btn-primary text-white me-3">
                  Watch Now
                </button>
                <button
                  className="btn btn-outline-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#ratingModal"
                >
                  <i className="fas fa-star me-2"></i>Rate
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="carousel-title section-padding">
        <Carousel
          title="More like this"
          cardWidth={22}
          cardHeight={32}
          data={recommendations}
        />
        <Carousel
          title="Trending Now"
          cardWidth={22}
          cardHeight={32}
          data={trendingMovies}
        />
      </div>

      {/* Rating Modal */}
      <div
        className="modal fade"
        id="ratingModal"
        tabIndex={-1}
        aria-labelledby="ratingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="ratingModalLabel">
                Rate this Movie
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-star fs-2 ${
                    selectedRating >= star
                      ? 'fas text-warning'
                      : 'far text-light'
                  } rating-star`}
                  onClick={() => handleStarClick(star)}
                  style={{ cursor: 'pointer' }}
                ></i>
              ))}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-light"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitRating}
                data-bs-dismiss="modal"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <CookieFavoriteGenre genre={movie?.genres?.[0]?.genreName} />
      <SimpleFooter />
    </div>
  );
};

export default DetailsPage;
