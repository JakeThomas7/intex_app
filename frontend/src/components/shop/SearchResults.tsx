import { useCallback, useEffect, useMemo, useState } from "react";
import GenreFilter from "./GenreFilter";
import Genre from "../../types/Genre";
import { fetchGenres, fetchMovies } from "../../api/MoviesAPI";
import Carousel from "./Carousel";
import Movie from "../../types/Movie";

const SearchResults = () => {

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
        handleSearch();
        console.log(movies)
        setIsOpen(false);
      }
    }, [selectedGenres]); 


    const [displayResults, setDisplayResults] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    //const navigate = useNavigate();

     // Chunk movies into groups of 8
    const movieChunks = useMemo(() => {
      const chunks = [];
      for (let i = 0; i < movies.length; i += 8) {
        chunks.push(movies.slice(i, i + 8));
      }
      return chunks;
    }, [movies]);

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

    const handleSearch = useCallback(async () => {
      if (isLoading || !hasMore) return;
      
      setIsLoading(true);
      try {
        const res = await fetchMovies({
          search: searchQuery,
          categories: selectedGenres.map(g => g.genreName),
          pageNum: currentPage,
          pageSize: 8 // Fetch 8 items per page
        });

        setMovies(prev => [...prev, ...res.data]);
        setHasMore(res.data.length === 8);
        setCurrentPage(prev => prev + 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    }, [currentPage, isLoading, hasMore, searchQuery, selectedGenres]);

    // Infinite scroll handler
    useEffect(() => {
      const handleScroll = () => {
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
        if (nearBottom && !isLoading && hasMore) {
          handleSearch();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, handleSearch]);

    const cancelSearch = () => {
      setDisplayResults(false);
      setSearchQuery('');
      setSelectedGenres([]);
      setMovies([]);
      setCurrentPage(1);
      setHasMore(true);
    };
    



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
                  placeholder={`${isLoading ? 'Loading...' : 'Search Movies'}`}
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading}
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
      {displayResults && (
        <div className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-start mt-4 section-padding">
            <button 
              className="btn btn-light btn-sm text-end px-3 py-2 me-2" 
              onClick={cancelSearch}
            >
              <i className="fa-solid fa-xmark"></i> Clear Search
            </button>
          </div>

          {movieChunks.map((chunk, index) => (
            <Carousel
              key={index}
              title={index === 0 ? "Top Results" : `More Results ${index + 1}`}
              data={chunk}
            />
          ))}

          {isLoading && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!hasMore && (
            <div className="text-center text-muted py-4">
              No more movies to show
            </div>
          )}
      </div>
      )}
    </div>
    )
  </div>
  )
}

export default SearchResults