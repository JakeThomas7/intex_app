import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMovies } from "../../api/MoviesAPI";
import Genre from "../../types/Genre";
import Movie from "../../types/Movie";
import Carousel from "./Carousel";

const MovieResults = ({
    searchQuery, 
    selectedGenres,
  }: {
    searchQuery: string, 
    selectedGenres: Genre[], 
  }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
  
    // Reset state when search criteria changes
    useEffect(() => {
      setMovies([]);
      setCurrentPage(1);
      setHasMore(true);
    }, [searchQuery, selectedGenres]);
  
    const movieChunks = useMemo(() => {
      const chunks = [];
      for (let i = 0; i < movies.length; i += 6) {
        chunks.push(movies.slice(i, i + 6));
      }
      return chunks;
    }, [movies]);
  
    const handleSearch = useCallback(async () => {
        if (isLoading || !hasMore) return;
      
        setIsLoading(true);
        try {
          const res = await fetchMovies({
            pageNum: currentPage,
            pageSize: 24, // Load 4 carousels' worth
            search: searchQuery,
            categories: selectedGenres.map(genre => genre.genreName)
          });
      
          setMovies(prev => [...prev, ...res.data]);
      
          // If fewer than 24 results returned, there's no more data
          setHasMore(res.data.length === 24);
      
          setCurrentPage(prev => prev + 1);
        } catch (error) {
          // console.error("Error fetching movies:", error);
        } finally {
          setIsLoading(false);
        }
      }, [currentPage, isLoading, hasMore, searchQuery, selectedGenres]);
  
    // Initial load and scroll handler
    useEffect(() => {
      const loadInitial = async () => {
        if (currentPage === 1 && movies.length === 0 && !isLoading) {
          await handleSearch();
        }
      };
      loadInitial();
    }, [currentPage, movies.length, isLoading, handleSearch]);

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
  
    return (
      <div>
        {movieChunks.map((chunk, index) => (
          <Carousel
            key={index}
            title={index === 0 ? "Search Results" : ``}
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
  
        {!hasMore && movies.length === 0 && (
          <h4 className="text-center py-4 text-white">
            No movies found matching your criteria
          </h4>
        )}
  
        {!hasMore && movies.length > 0 && (
          <h4 className="text-center py-4 text-white">
            No more movies to show
          </h4>
        )}
      </div>
    );
  };

export default MovieResults;