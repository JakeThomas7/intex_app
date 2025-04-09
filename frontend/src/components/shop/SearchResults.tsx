import { useEffect, useState } from "react";
import GenreFilter from "./GenreFilter";
import Genre from "../../types/Genre";
import { fetchGenres, fetchMovies } from "../../api/MoviesAPI";
import { useNavigate } from "react-router-dom";
import Movie from "../../types/Movie";

const SearchResults = () => {

    // PUTTING TOGETHER SEARCHING / FILTERING CONTROLS -----------
    //const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
  
    useEffect(() => {

        const getGenres = async () => {
          try {
            const data = await fetchGenres();
            setGenres(data);
          } catch (error) {
            console.error('Error fetching genres:', error);
          }
        };
        getGenres();
    }, [isOpen]);
  
    const containerStyle = {
      overflow: "hidden",
      maxHeight: isOpen ? "300px" : "0", // Adjust the maxHeight based on your content
      transition: "max-height 0.3s ease-in-out", // Smooth transition effect
    };
  
    const removeGenre = (genre: Genre) => {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    };

    

    useEffect(() => {
      if (searchQuery || selectedGenres.length > 0) {
        setIsOpen(false);
        handleSearch();
      }
    }, [selectedGenres]); 


    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    //const [numMovies, setNumMovies] = useState(0);
    const [loading, setLoading] = useState(false);
    //const [error, setError] = useState<string | null>(null);
    const handleSearch = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies({ search: searchQuery, categories: selectedGenres.map(g => g.genreName), pageSize: 20 });
        setMovies(data.data);
        //setNumMovies(data.totalCount);
        setDisplayResults(true);
      } catch (error) {
        console.error("Error fetching headlines:", error);
        setError("Failed to load headlines. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    const [displayResults, setDisplayResults] = useState(false);
  



  return (
    <div>
    <div className="d-flex flex-column align-items-center w-100" onSubmit={(event) => {
        event?.preventDefault();
        setDisplayResults(true);
        setIsOpen(false);
        handleSearch();
      }}>
          {/* Search Bar and Filter */}
          <div className="w-75">
            <div className="d-flex justify-content-between align-items-center mt-4">
              <form id="search-movies"className="position-relative w-100 me-3 d-flex justify-content-center">

                <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-primary" />
                <input
                  type="search"
                  className="form-control form-control-lg ps-5 py-1 me-2"
                  placeholder={`${loading ? 'Loading...' : 'Search Movies'}`}
                  aria-label="Search products"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
                
              </form>
            </div>

            {/* Filter Genres Button */}
            <div className="d-flex justify-content-start w-100 mt-3 flex-wrap gap-2">
              <button className="btn btn-outline-light w-auto d-flex align-items-center w-25 me-2 "
               onClick = {() => setIsOpen(!isOpen)}
              >
                Filter Genres
                <i className="ms-3 fa-solid fa-chevron-right" />
              </button>
              {selectedGenres.map((genre) => (
                <button
                  key={genre.genreId}
                  className="btn btn-sm btn-light d-flex align-items-center"
                  onClick={() => removeGenre(genre)}
                >
                  {genre.genreName}
                  <i className="fa-solid fa-xmark fa-sm ms-2" />
                </button>
              ))}
            </div>
            

            {/* Genre Filter Dropdown */}
          <div style={containerStyle} className="w-100 mt-2">
            {isOpen && (
              <GenreFilter
                genres={genres}
                setSelectedGenres={setSelectedGenres}
                selectedGenres={selectedGenres}
              />
            )}
          </div>

          </div>
      </div>

      <div>
      {displayResults && movies.length > 0 && (
        
  <div className="d-flex flex-column align-items-center w-100 section-padding my-5">
    <h3 className="text-white w-100 text-start mb-3">Your Search Results <button className="btn btn-sm btn-outline-light" onClick={() => setDisplayResults(false)}>Clear</button></h3>
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {movies.map((movie: Movie, index) => (
        <div
          key={index}
          className="col"
          onClick={() => navigate('/details')}
        >
          <div className="card-item">
            <div
              className="card h-100 shadow grow-sm position-relative"
              style={{
                borderRadius: '12px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                border: 'none',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              {/* Movie Poster */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={`https://intex2movieposters.blob.core.windows.net/movie-postersv2/${movie.image_url_suffix}`}
                  alt={movie.title}
                  className="img-fluid"
                  style={{
                    width: '100%',
                    height: '350px',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <div 
                  className="position-absolute bottom-0 start-0 end-0 p-3"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    paddingTop: '2rem'
                  }}
                >
                  <h5 className="mb-0" style={{ fontWeight: '600' }}>{movie.title}</h5>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-warning text-dark">
                    {movie.releaseYear}
                  </span>
            
                  <div className="d-flex">
                  <span>
                    {movie.averageRating > 0 && (
                      <>
                        {movie.averageRating}
                        <i className="fa-solid fa-star ms-1" style={{ color: "#FFD43B" }}></i>
                      </>
                    )}
                  </span>                  
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
      </div> 
    </div>
  )
}

export default SearchResults