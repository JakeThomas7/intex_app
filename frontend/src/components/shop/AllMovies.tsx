import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchMovies } from "../../api/MoviesAPI";
import Movie from "../../types/Movie";
import Carousel from "./Carousel";

const AllMovies = () => {
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Chunk movies into groups of 8
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
        pageSize: 6
      });

      setMovies(prev => [...prev, ...res.data]);
      setHasMore(res.data.length === 6);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, hasMore]);

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


  return (
    <div>
        {/* Results Section */}
        <hr className="text-light"/>
        <h1 className="text-start section-padding text-light my-4">All Movies</h1>
        <hr className="text-light"/>
        {movieChunks.map((chunk, index) => (
        <Carousel
            key={index}
            title={index === 0 ? "" : ``}
            data={chunk}
        />
        ))}

      {/* Search Section */}

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
  )
};

export default AllMovies;