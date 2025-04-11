import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home/CardCarousel.css';

interface CarouselProps {
  title?: string;
  cardWidth?: number;
  cardHeight?: number;
  data: Array<any>;
}

const fallbackImage =
  'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg';

const sanitizeTitleForURL = (title: string): string => {
  return title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '%20');
};

const Carousel = ({
  title = '',
  cardWidth = 22,
  cardHeight = 32,
  data,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(scrollDistance);

  useEffect(() => {
    const updateDimensions = () => {
      if (carouselRef.current) {
        setScrollDistance(window.innerWidth * 0.66);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      setLoading(true);
      const urls = await Promise.all(
        data.map(async (item) => {
          if (item.title) {
            const sanitized = sanitizeTitleForURL(item.title);
            const testUrl = `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${sanitized}.jpg`;
            const isValid = await new Promise<boolean>((resolve) => {
              const img = new Image();
              img.src = testUrl;
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
            });
            return isValid ? testUrl : fallbackImage;
          } else {
            return fallbackImage;
          }
        })
      );
      setImageUrls(urls);
      setLoading(false);
    };
    preloadImages();
  }, [data]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'right' ? 300 : -300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="carousel-section position-relative pt-4">
      <h3 className="section-padding">{title}</h3>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => scroll('left')}
            className="btn btn-light position-absolute top-50 translate-middle-y start-0 ms-3 carousel-controls d-none d-sm-block"
          >
            <i className="fa-solid fa-chevron-left fa-lg px-2 py-5"></i>
          </button>
          <div
            ref={carouselRef}
            className="d-flex overflow-x-auto pt-2 pb-4 scrollbar-hidden section-padding"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-2 card-item"
                style={{
                  scrollSnapAlign: 'start',
                  maxWidth: `${cardWidth}rem`,
                  height: `${cardHeight}rem`,
                }}
                onClick={() => navigate(`/details/${item.showId}`)}
              >
                <div
                  className="shadow grow-sm h-100 d-flex flex-column position-relative"
                  style={{
                    borderRadius: '18px',
                    backgroundColor: 'black',
                    color: 'white',
                    border: '2px solid white',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ height: '85%' }}>
                    <img
                      src={imageUrls[index] || fallbackImage}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px 10px 0 0',
                      }}
                    />
                  </div>
                  <div
                    className="px-3 py-2 text-center"
                    style={{
                      height: '15%',
                      backgroundColor: '#111',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '1.5rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '1rem',
                        color: '#bbb',
                        margin: 0,
                      }}
                    >
                      {item.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ minWidth: '16px', flexShrink: 0 }}></div>
          </div>
          <button
            onClick={() => scroll('right')}
            className="btn btn-light position-absolute top-50 translate-middle-y end-0 me-3 carousel-controls d-none d-sm-block"
          >
            <i className="fa-solid fa-chevron-right fa-xl px-2 py-5"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
