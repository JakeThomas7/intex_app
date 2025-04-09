import { useEffect, useState } from "react";
import GenreFilter from "./GenreFilter";
import Genre from "../../types/Genre";
import { fetchGenres } from "../../api/MoviesAPI";

const SearchResults = () => {

    // PUTTING TOGETHER SEARCHING / FILTERING CONTROLS -----------
    //const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
  
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
    }, []);
  
    const containerStyle = {
      overflow: "hidden",
      maxHeight: isOpen ? "300px" : "0", // Adjust the maxHeight based on your content
      transition: "max-height 0.3s ease-in-out", // Smooth transition effect
    };

    const searchStyle = {
        // overflow: "hidden",
        // maxHeight: isSearched ? "auto" : "0", // Adjust the maxHeight based on your content
        // transition: "max-height 0.3s ease-in-out", // Smooth transition effect
      };
  
    const removeGenre = (genre: Genre) => {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    };
  
    // function setSearching(arg0: boolean) {
    //     throw new Error("Function not implemented.");
    // }

    //   const handleSearch = async () => {
    //     try {
    //       const data = await fetchMovies({ search: searchQuery, categories: [genre] });
    //       setMovies(data.data);
    //       setNumMovies(data.totalCount);
    //     } catch (error) {
    //       console.error("Error fetching headlines:", error);
    //       setError("Failed to load headlines. Please try again later.");
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
  



  return (
    <div>
    <div className="d-flex flex-column align-items-center w-100" onSubmit={(event) => {
        event?.preventDefault();
        setIsSearched(true);
      }}>
          {/* Search Bar and Filter */}
          <div className="w-75">
            <div className="d-flex justify-content-between align-items-center mt-4">
              <form id="search-movies"className="position-relative w-100 me-3 d-flex justify-content-center">
                <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="search"
                  className="form-control form-control-lg ps-5 py-3 me-2"
                  placeholder="Search products, categories, etc."
                  aria-label="Search products"
                //   onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary w-25" form="search-movies" type="submit">Search Movies</button>
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
       <div style={searchStyle}>
            {isSearched && 
            <div className="w-75 text-white" >
            <div className="d-flex flex-wrap gap-2 justify-content-start overflow-x">  
                Top Restults
            </div>
          </div>
            }
            
        </div> 
    </div>
  )
}

export default SearchResults