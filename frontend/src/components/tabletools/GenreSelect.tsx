import { useEffect, useState } from "react";
import { fetchGenres } from "../../api/MoviesAPI";
import Genre from "../../types/Genre";
import "./GenreSelect.css"; // Create this CSS file

interface MultiSelectProps {
  onChange: (selectedOptions: Genre[]) => void;
  selectedValues: Genre[];
}

const GenreMultiSelect = ({ onChange, selectedValues }: MultiSelectProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        // console.error("Error fetching genres:", error);
        setError("Failed to load genres. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getGenres();
  }, []);

  const handleToggle = (genre: Genre) => {
    const isSelected = selectedValues.some(g => g.genreId === genre.genreId);
    const updatedSelection = isSelected
      ? selectedValues.filter(g => g.genreId !== genre.genreId)
      : [...selectedValues, genre];
    onChange(updatedSelection);
  };

  const filteredGenres = genres.filter(genre =>
    genre.genreName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="dropdown-container">Loading genres...</div>;
  if (error) return <div className="dropdown-container">{error}</div>;

  return (
    <div className="dropdown-container position-relative">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {selectedValues.length > 0 
          ? `${selectedValues.length} genres selected`
          : "Select Genres"}
      </button>

      {isOpen && (
        <div 
          className="dropdown-menu show p-2"
          style={{ width: "300px", maxHeight: "400px", overflowY: "auto" }}
        >
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />

          <div className="list-group">
            {filteredGenres.map((genre) => {
              const isSelected = selectedValues.some(g => g.genreId === genre.genreId);
              return (
                <button
                  key={genre.genreId}
                  type="button"
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    isSelected ? "active" : ""
                  }`}
                  onClick={() => handleToggle(genre)}
                >
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={isSelected}
                    readOnly
                  />
                  {genre.genreName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreMultiSelect;
