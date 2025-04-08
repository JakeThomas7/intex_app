import { useNavigate } from "react-router-dom";
import Movie from "../../../types/Movie";
import DeleteButton from "../../tabletools/DeleteButton";
import { deleteMovie } from "../../../api/MoviesAPI";
// Import your API delete function or define it here

const AdminMovieCard = ({
  movie,
  onMovieDeleted
}: {
  movie: Movie;
  onMovieDeleted: () => void;
}) => {

  const navigate = useNavigate();
  const handleDeleteMovie = async () => {
    // Replace with actual API call to delete the movie
    console.log("Deleting movie:", movie.showId);
    try {
      await deleteMovie(movie.showId);
      onMovieDeleted();
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

  return (
    <div className="col">
      <div className="card bg-light h-100 border-0">


        {/* Card Body */}
        <div className="card-body d-flex flex-column">
        <h4>{movie.title || "Untitled Movie"}</h4>
          {/* Movie Details */}
          <ul className="list-unstyled mb-4">
            {movie.releaseYear && (
              <li>
                <strong>Release Year:</strong> {movie.releaseYear}
              </li>
            )}
            {movie.rating && (
              <li>
                <strong>Rating:</strong> {movie.rating}
              </li>
            )}
            {movie.duration && (
              <li>
                <strong>Duration:</strong> {movie.duration}
              </li>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <li>
                <strong>Genres:</strong>{" "}
                {movie.genres.map((genre) => genre.genreName).join(", ")}
              </li>
            )}
          </ul>

          {/* Buttons */}
          <div className="mt-auto d-flex justify-content-between">
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                navigate("/admin/edit", {
                  state: { movie }, // Pass the entire movie object to the next page
                })
              }
            >
              Edit <i className="fa-solid fa-chevron-right fa-sm"></i>
            </button>
            <DeleteButton handleConfirmDelete={() => handleDeleteMovie()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMovieCard;