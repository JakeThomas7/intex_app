import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home/CardCarousel.css';

interface CarouselProps {
  title?: string;
  cardWidth?: number; // in rem
  cardHeight?: number; // in rem
  data: Array<any>; // Your product data
}

const Carousel = ({
  title = '',
  cardWidth = 19, // Default 19rem
  cardHeight = 19, // Default 19rem
  data,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateDimensions = () => {
      if (carouselRef.current) {
        // Calculate scroll distance (2/3 of viewport width)
        setScrollDistance(window.innerWidth * 0.66);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'right' ? scrollDistance : -scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="carousel-section position-relative pt-4">
      <h3 className="section-padding">{title}</h3>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="btn btn-light position-absolute top-50 translate-middle-y start-0 ms-3 carousel-controls d-none d-sm-block"
      >
        <i className="fa-solid fa-chevron-left fa-lg px-2 py-5"></i>
      </button>

      {/* Carousel Container */}
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
              scrollMargin: '0 0 0 clamp(3rem, 5vw, 6rem)',
              maxWidth: `${cardWidth}rem`,
              height: `${cardHeight}rem`,
            }}
            onClick={() => navigate(`/details/${item.id}`)}
          >
            <div
              className="p-4 lead shadow grow-sm h-100 position-relative"
              style={{
                borderRadius: '18px',
                backgroundColor: 'black',
                color: 'white',
                border: '2px solid white',
                fontSize: '1.5rem',
                minWidth: '200px',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Rank Number */}
              <div
                className="rank-badge"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-2rem', // Adjust left position to make it stick out
                  transform: 'translateY(-50%)',
                  width: '3rem', // Tall and skinny
                  height: '5rem', // Tall height
                  border: '2px solid white',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  backgroundColor: 'black',
                  color: 'white',
                }}
              >
                {item.rank} {/* Display rank number */}
              </div>

              {/* Movie Poster */}
              <img
                src={item.imagePath} // Movie poster image
                alt={item.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  objectFit: 'cover',
                }}
              />
              <h4>{item.title}</h4>
              <p>{item.year}</p>
            </div>
          </div>
        ))}

        {/* Last spacer */}
        <div style={{ minWidth: '16px', flexShrink: 0 }}></div>
      </div>

      <button
        onClick={() => scroll('right')}
        className="btn btn-light position-absolute top-50 translate-middle-y end-0 me-3 carousel-controls d-none d-sm-block"
      >
        <i className="fa-solid fa-chevron-right fa-xl px-2 py-5"></i>
      </button>
    </div>
  );
};

export default Carousel;
