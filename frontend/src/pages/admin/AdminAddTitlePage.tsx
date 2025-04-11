import { useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMovie } from '../../api/MoviesAPI';
import Movie from '../../types/Movie';
import Genre from '../../types/Genre';
import GenreSelect2 from '../../components/tabletools/GenreSelect2';

const AdminAddTitlePage = () => {
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState<Movie>({
    showId: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: undefined,
    rating: '',
    duration: '',
    description: '',
    genres: [],
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Derived state
  const isMovie = type === 'movie';
  const isShow = type === 'show';
  const isOther = type === 'other';

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [id]: id === 'rating' ? Number(value) : value,
    }));
  };

  const formatDuration = (
    duration: string,
    isMovie: boolean,
    isShow: boolean
  ) => {
    return `${duration} ${isMovie ? 'minutes' : isShow ? 'seasons' : ''}`;
  };

  const handleDurationChange = (duration: string) => {
    setFormData((prev: any) => ({
      ...prev,
      duration: formatDuration(duration, isMovie, isShow),
    }));
  };

  const handleGenreChange = (selectedOptions: Genre[]) => {
    setFormData((prev: any) => ({
      ...prev,
      genres: selectedOptions,
    }));

    console.log(formData);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        type: isOther ? formData.type : isMovie ? 'Movie' : 'TV Show',
      };

      await createMovie(payload);
      navigate('/admin');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="fw-bold">Add Title</h4>
          <hr />
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <button
              type="button"
              className={`btn ${isMovie ? 'btn-primary' : 'btn-outline-primary'} p-4`}
              onClick={() => navigate('/admin/add/movie')}
            >
              Movie
            </button>
            <button
              type="button"
              className={`btn ${isShow ? 'btn-primary' : 'btn-outline-primary'} p-4`}
              onClick={() => navigate('/admin/add/show')}
            >
              TV Show
            </button>
            <button
              type="button"
              className={`btn ${isOther ? 'btn-primary' : 'btn-outline-primary'} p-4`}
              onClick={() => navigate('/admin/add/other')}
            >
              Other
            </button>
          </div>
        </div>
      </div>

      {/* Basic Information Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-4">Basic Information</h4>
          <hr />
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                maxLength={200}
                className="form-control"
                id="title"
                required
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="type" className="form-label">
                Type
              </label>
              <input
                type="text"
                maxLength={10}
                className="form-control"
                value={isMovie ? 'Movie' : isShow ? 'TV Show' : 'Other'}
                disabled
              />
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                maxLength={450}
                rows={3}
                required
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          {/* Production Details Card */}
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Production Details</h4>
              <hr />
              <div className="mb-3">
                <label htmlFor="director" className="form-label">
                  Director
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="director"
                  maxLength={100}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cast" className="form-label">
                  Cast
                </label>
                <textarea
                  className="form-control"
                  id="cast"
                  rows={4}
                  maxLength={250}
                  onChange={handleChange}
                  placeholder="Comma separated list"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  maxLength={50}
                  className="form-control"
                  id="country"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 ">
          {/* Media Info Card */}
          <div className="card shadow-sm mb-4 h-100">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Media Information</h4>
              <hr />

              <div className="w-100 mb-3">
                <label className="form-label">Genre</label>
                <GenreSelect2
                  onChange={handleGenreChange}
                  selectedValues={formData.genres ?? []}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="releaseYear" className="form-label">
                  Release Year
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="releaseYear"
                  min="0"
                  max="9999"
                  step="1"
                  required
                  value={formData.releaseYear}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="rating" className="form-label">
                  MPAA Rating
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="rating"
                  maxLength={20}
                  required
                  onChange={handleChange}
                />
              </div>

              {isMovie && (
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="duration"
                    min={0}
                    max={2000}
                    required
                    onChange={(e) => handleDurationChange(e.target.value)}
                  />
                </div>
              )}

              {isShow && (
                <div className=" mb-3">
                  <label htmlFor="seasons" className="form-label">
                    Seasons
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="seasons"
                    min={0}
                    max={2000}
                    required
                    onChange={(e) => handleDurationChange(e.target.value)}
                  />
                </div>
              )}

              {isOther && (
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="duration"
                    maxLength={20}
                    placeholder="e.g., 2h 30m"
                    required
                    onChange={(e) => handleDurationChange(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Card */}
      <div className="card shadow-sm">
        <div className="card-body text-end">
          <button
            type="button"
            className="btn btn-outline-secondary me-2 p-2"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary p-2"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Submitting
              </>
            ) : (
              'Create Title'
            )}
          </button>
          {error && (
            <div className="text-center text-danger mt-3">{error}</div> // Display error message">
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAddTitlePage;
