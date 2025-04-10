import { useNavigate } from 'react-router-dom';
import Movie from '../../../types/Movie';
import DeleteButton from '../../tabletools/DeleteButton';
import { deleteMovie } from '../../../api/MoviesAPI';

// Function to sanitize the movie title by removing special characters (except spaces)
const sanitizeTitleForURL = (title: string): string => {
  return title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
};

const AdminMovieCard = ({
  movie,
  onMovieDeleted,
}: {
  movie: Movie;
  onMovieDeleted: () => void;
}) => {
  const navigate = useNavigate();

  // Handle undefined title by providing a default value if necessary
  const sanitizedTitle = sanitizeTitleForURL(movie.title || 'Untitled Movie');

  const handleDeleteMovie = async () => {
    console.log('Deleting movie:', movie.showId);
    try {
      await deleteMovie(movie.showId);
      onMovieDeleted();
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };

  // Default fallback image URL if the poster cannot be loaded
  const defaultImageUrl =
    'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg';

  return (
    <div className="col">
      <div className="card bg-light h-100 border-0 overflow-hidden d-flex flex-column">
        {/* Conditional Image Container */}
        {movie.image_url_suffix && (
          <div
            className="position-relative"
            style={{
              aspectRatio: '2/3',
              flexShrink: 0, // Prevent shrinking
              background:
                'linear-gradient(45deg, #f5f5f5 25%, #e0e0e0 50%, #f5f5f5 75%)',
              backgroundSize: '400% 400%',
              animation: 'shimmer 1.5s infinite',
            }}
          >
            {/* Use sanitized title to build image URL */}
            <img
              src={`https://intex2movieposters.blob.core.windows.net/movie-postersv2/${sanitizedTitle}.jpg`}
              alt={''}
              className="w-100 h-100"
              style={{
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                // Fallback to the default image if the movie poster is not available
                e.currentTarget.src = defaultImageUrl;
              }}
            />
          </div>
        )}

        {/* Card Body - Always takes remaining space */}
        <div className="card-body d-flex flex-column flex-grow-1">
          <h4 className="mb-3">{movie.title || 'Untitled Movie'}</h4>
          {/* Movie Details */}
          <ul className="list-unstyled mb-4">
            {movie.releaseYear && (
              <li className="mb-2">
                <strong>Release Year:</strong> {movie.releaseYear}
              </li>
            )}
            {movie.rating && (
              <li className="mb-2">
                <strong>Rating:</strong> {movie.rating}
              </li>
            )}
            {movie.duration && (
              <li className="mb-2">
                <strong>Duration:</strong> {movie.duration}
              </li>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <li className="mb-2">
                <strong>Genres:</strong>{' '}
                {movie.genres.map((genre) => genre.genreName).join(', ')}
              </li>
            )}
          </ul>

          {/* Buttons */}
          <div className="mt-auto d-flex justify-content-between gap-2">
            <button
              className="btn btn-outline-primary flex-grow-1"
              onClick={() =>
                navigate('/admin/edit', {
                  state: { movie },
                })
              }
            >
              Edit <i className="fa-solid fa-chevron-right fa-sm"></i>
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate(`/details/${movie.showId}`)}
            >
              View Movie <i className="fa-solid fa-chevron-right fa-sm"></i>
            </button>
            <DeleteButton handleConfirmDelete={() => handleDeleteMovie()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMovieCard;
