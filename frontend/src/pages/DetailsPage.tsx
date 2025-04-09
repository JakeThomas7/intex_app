import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/all_pages/Navbar';
import Carousel from '../components/shop/Carousel';
import '../styles/DetailsPage.css';
import placeholder from '../assets/sanddust.jpg';
import Movie from '../types/Movie';
import SimpleFooter from '../components/all_pages/SimpleFooter';
// import { useAuth } from '../components/context/AuthContext';

const DetailsPage = () => {
  const location = useLocation();
  const initialMovie = location.state?.movie;
  const [movie, setMovie] = useState<Movie | null>(initialMovie || null);
  const [loading, setLoading] = useState(!initialMovie);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const data = [
    { description: 'Recommended movie 1' },
    { description: 'Recommended movie 2' },
    { description: 'Recommended movie 3' },
  ];

  useEffect(() => {
    if (initialMovie) {
      setMovie(initialMovie);
      setLoading(false);
    } else {
      console.warn(
        "⚠️ No movie found in route state. Movie won't be displayed."
      );
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
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0.2) 70%, rgba(255, 255, 255, 0.1) 100%), url(${placeholder})`,
        }}
      >
        <div className="details-overlay container">
          {loading ? (
            <p className="text-white">Loading movie...</p>
          ) : (
            <>
              <p className="movie-subinfo">
                {movie?.releaseYear || 'N/A'} • {movie?.duration || 'N/A'} •{' '}
                {movie?.rating || 'N/A'}
              </p>
              <h1 className="movie-title">{movie?.title || 'Movie Title'}</h1>

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

      <div className="details-carousels section-padding">
        <Carousel
          title="More like this"
          cardWidth={25}
          cardHeight={21}
          data={data}
        />
        <Carousel
          title="Trending Now"
          cardWidth={19}
          cardHeight={19}
          data={data}
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
                onClick={() =>
                  console.log(`Submitted rating: ${selectedRating}`)
                }
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
