import Genre from "../../types/Genre";

interface Props {
    genres: Genre[];
    selectedGenres: Genre[];
    setSelectedGenres: (genres: Genre[]) => void;
  }
const GenreFilter = ({genres, selectedGenres, setSelectedGenres} : Props) => {

      const handleGenreClick = (genre: Genre) => {
          // Add if not selected
          setSelectedGenres([...selectedGenres, genre]);
        
      };

      return (
        <div>
          <div className="d-flex flex-wrap gap-2 justify-content-start overflow-x">
            {genres
              .filter((genre) => !selectedGenres.some(g => g.genreId === genre.genreId))
              .map((genre, index) => (
                <button
                  key={index}
                  className="btn btn-sm btn-outline-light d-flex align-items-center"
                  onClick={() => handleGenreClick(genre)}
                >
                  {genre.genreName}
                  <i className="fa-solid fa-plus ms-2"></i>
                </button>
              ))}
          </div>
        </div>
      );
}

export default GenreFilter