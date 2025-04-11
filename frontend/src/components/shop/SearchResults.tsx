import GenreFilter from "./GenreFilter";
import Genre from "../../types/Genre";
import { fetchGenres } from "../../api/MoviesAPI";
import MovieResults from "./MovieResults";
import { useEffect, useRef, useState } from "react";

const SearchResults = ({isSearching, setIsSearching}: {isSearching: boolean, setIsSearching: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Fetch genres on mount
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

    // Handle search criteria changes
    useEffect(() => {
        const hasSearchCriteria = selectedGenres.length > 0 || searchQuery.trim() !== '';
        setIsSearching(hasSearchCriteria);
    }, [selectedGenres, searchQuery, setIsSearching]);

    useEffect(() => {
        setIsOpen(false)
    }, [selectedGenres]);

    const containerStyle = {
        overflow: "hidden",
        maxHeight: isOpen ? "300px" : "0",
        transition: "max-height 0.3s ease-in-out",
    };

    const removeGenre = (genre: Genre) => {
        setSelectedGenres(prev => prev.filter((g) => g !== genre));
    };

    const searchInputRef = useRef<HTMLInputElement>(null);

    const cancelSearch = () => {
        setSearchQuery('');
        setSelectedGenres([]);
        setIsSearching(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);
    };

    return (
        <div>
            <div className="d-flex flex-column align-items-center w-100">
                {/* Search Bar and Filter */}
                <div className="w-75">
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <form 
                            id="search-movies" 
                            className="position-relative w-100 me-3 d-flex justify-content-center"
                            onSubmit={handleSubmit}
                        >
                            <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-primary" />
                            <input
                                ref={searchInputRef}
                                type="search"
                                className="form-control form-control-lg ps-5 py-1 me-2"
                                placeholder="Search Movies"
                                aria-label="Search movies"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Filter Genres Button */}
                    <div className="d-flex justify-content-start w-100 mt-3 flex-wrap gap-2">
                        <button 
                            className="btn btn-outline-light w-auto d-flex align-items-center w-25 me-2"
                            onClick={() => setIsOpen(!isOpen)}
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

            {isSearching && (
                <div className="d-flex flex-column gap-4">
                    <div className="d-flex justify-content-start mt-4 section-padding">
                        <button 
                            className="btn btn-light btn-sm text-end px-3 py-2 me-2" 
                            onClick={cancelSearch}
                        >
                            <i className="fa-solid fa-xmark"></i> Clear Search
                        </button>
                    </div>

                    <MovieResults 
                        searchQuery={searchQuery} 
                        selectedGenres={selectedGenres} 
                    />
                </div>
            )}
        </div>
    );
};

export default SearchResults;