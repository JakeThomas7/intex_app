import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchMovies } from "../../api/MoviesAPI";
import Movie from "../../types/Movie";
import Carousel from "./Carousel";

// Utility for fallback image and sanitization
// const DEFAULT_IMAGE_URL =
//   "https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg";

const sanitizeTitleForURL = (title: string): string => {
  return title.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "%20");
};

// Unified interface expected by Carousel
interface CarouselMovie {
  title: string;
  imagePath: string;
  year: number;
  rank: number;
  showId: string;
}

const AllMovies = () => {
  const [carouselMovies, setCarouselMovies] = useState<CarouselMovie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const movieChunks = useMemo(() => {
    const chunks: CarouselMovie[][] = [];
    for (let i = 0; i < carouselMovies.length; i += 6) {
      chunks.push(carouselMovies.slice(i, i + 6));
    }
    return chunks;
  }, [carouselMovies]);

  const handleSearch = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await fetchMovies({
        pageNum: currentPage,
        pageSize: 6,
      });

      const enhancedMovies: CarouselMovie[] = res.data.map((movie: Movie, idx: number) => {
        const sanitized = sanitizeTitleForURL(movie.title || "Untitled");
        const imagePath = movie.image_url_suffix
          ? `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${movie.image_url_suffix}`
          : `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${sanitized}.jpg`;

        return {
          title: movie.title || "Untitled",
          imagePath: imagePath,
          year: movie.releaseYear ?? 0,
          rank: carouselMovies.length + idx + 1,
          showId: movie.showId ?? `unknown-${Date.now()}-${idx}`,
        };
      });

      setCarouselMovies((prev) => [...prev, ...enhancedMovies]);
      setHasMore(res.data.length === 6);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, hasMore, carouselMovies.length]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
      if (nearBottom && !isLoading && hasMore) {
        handleSearch();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, handleSearch]);

  return (
    <div>
      <hr className="text-light" />
      <h1 className="text-start section-padding text-light my-4">All Movies</h1>
      <hr className="text-light" />

      {movieChunks.map((chunk, index) => (
        <Carousel
          key={index}
          title={index === 0 ? "" : ``}
          data={chunk}
          cardWidth={22}
          cardHeight={32}
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
  );
};

export default AllMovies;
