import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/all_pages/Navbar';
import Carousel from '../components/shop/Carousel';
import '../styles/DetailsPage.css';
import placeholder from '../assets/sanddust.jpg';
import Movie from '../types/Movie';
import SimpleFooter from '../components/all_pages/SimpleFooter';
import { getItemHybridRecommender } from '../api/RecommenderAPI';
// import { useAuth } from '../components/context/AuthContext';
import { submitRating } from '../api/MoviesAPI';
import { useAuth } from '../components/context/AuthContext';

const API_URL = 'https://api2.byjacobthomas.com';

interface CarouselMovie {
  title: string;
  imagePath: string;
  year: number;
  rank: number;
  id: string;
}

const DetailsPage = () => {
  const location = useLocation();
  const initialMovie = location.state?.movie;
  const [movie, setMovie] = useState<Movie | null>(initialMovie || null);
  const [loading, setLoading] = useState(!initialMovie);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<CarouselMovie[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // ✅ added

  const { user } = useAuth();

  const handleSubmitRating = async () => {
    if (!movie?.showId || !selectedRating || userId === null) return;

    try {
      await submitRating(userId, movie.showId, selectedRating);
      setUserRating(selectedRating); // ✅ update UI
      alert("Rating submitted successfully!");
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("Error submitting rating.");
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!movie?.showId) return;

      try {
        const recs = await getItemHybridRecommender(movie.showId);

        const mapped = recs.map((m, idx) => ({
          title: m.title ?? 'Untitled',
          imagePath: m.image_url_suffix
            ? `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${m.image_url_suffix}`
            : 'https://intex2movieposters.blob.core.windows.net/movie-postersv2/default.jpg',
          year: m.releaseYear ?? 0,
          rank: idx + 1,
          id: m.showId ?? `unknown-${idx}`,
        }));

        setRecommendations(mapped);
      } catch (error) {
        console.error('Error fetching hybrid recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [movie?.showId]); // more precise dependency

  useEffect(() => {
    if (initialMovie) {
      setMovie(initialMovie);
      setLoading(false);

      const fetchRatingData = async () => {
        try {
          const response = await fetch(`${API_URL}/MovieRating/GetMovieDetailsPage/${initialMovie.showId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify("patrick59@gmail.com")
          });

          if (!response.ok) throw new Error('Failed to fetch rating data');

          const result = await response.json();
          setAverageRating(result.Movie.AverageRating);
          setUserRating(result.UserRating);
          setUserId(result.User.UserId); // ✅ capture user ID
        } catch (err) {
          console.error("❌ Error fetching average rating:", err);
        }
      };

      fetchRatingData();
    } else {
      console.warn("⚠️ No movie found in route state. Movie won't be displayed.");
    }
  }, [initialMovie]);

  const handleStarClick = (value: number) => {
    setSelectedRating(value);
  };

  return (
    <div>
      <Navbar />
      <div
        className="details-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0.2) 70%, rgba(255, 255, 255, 0.1) 100%), url(${`https://intex2movieposters.blob.core.windows.net/movie-postersv2/${movie?.image_url_suffix}`})`,
        }}
      >
        <div className="details-overlay container">
          {loading ? (
            <p className="text-white">Loading movie...</p>
          ) : (
            <>
              <p className="movie-subinfo">
                  {movie?.rating || 'N/A'}
              </p>
              <h1 className="movie-title">{movie?.title || 'Movie Title'}</h1>

              <div className="movie-stats d-flex align-items-center gap-3 flex-wrap mb-3">
              <span className="stat-pill">
                <i className="fas fa-star me-1 text-warning"></i>
                {movie?.averageRating?.toFixed(1) ?? "0.0"}
              </span>
              <span className="stat-pill">
                <i className="fas fa-calendar-alt me-1"></i>
                {movie?.releaseYear || 'N/A'}
              </span>
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
                {movie?.description || 'This is a brief description of the movie.'}
              </p>

              <div className="movie-actions">
  <button className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', borderWidth: '2px'}}>
              <i className="fas fa-play"></i>
            </button>
            
            <button
              className="btn btn-outline-secondary"
              data-bs-toggle="modal"
              data-bs-target="#ratingModal"
            >
              <i className="fas fa-star me-2"></i>Rate
            </button>
            {userRating !== null && (
              <p className="text-white mt-2">Your Rating: ⭐ {userRating}</p>
            )}
          </div>

            </>
          )}
        </div>
      </div>

      <div className="carousel-title section-padding">
        <Carousel
          title="More like this"
          cardWidth={25}
          cardHeight={21}
          data={recommendations}
        />
        <Carousel
          title="Trending Now"
          cardWidth={19}
          cardHeight={19}
          data={recommendations}
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
              <h5 className="modal-title" id="ratingModalLabel">Rate this Movie</h5>
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
                  className={`fa-star fs-2 ${selectedRating >= star ? 'fas text-warning' : 'far text-light'} rating-star`}
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
                  onClick={() => {
                    handleSubmitRating();
                    const modalElement = document.getElementById("ratingModal");
                    const modalInstance = window.bootstrap?.Modal.getInstance(modalElement!);
                    modalInstance?.hide();
                  }}
                >
                  Submit
                </button>

            </div>
          </div>
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
};

export default DetailsPage;
