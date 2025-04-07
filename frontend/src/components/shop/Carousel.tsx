import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home/CardCarousel.css";

interface CarouselProps {
  title?: string;
  cardWidth?: number; // in rem
  cardHeight?: number; // in rem
  data: Array<any>; // Your product data
}

const Carousel = ({
  title = "",
  cardWidth = 19, // Default 19rem
  cardHeight = 19, // Default 19rem
  data
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateDimensions = () => {
      if (carouselRef.current) {
        // Calculate scroll distance (2/3 of viewport width)
        setScrollDistance(window.innerWidth * 0.66);
        
        // If you still need cardWidth for other calculations:
        const firstCard = carouselRef.current.querySelector('.card-item');
        if (firstCard) {
          // Optional: Can remove if using prop cardWidth
        }
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
      <h3 className="section-padding">
        {title}
      </h3>

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
              height: `${cardHeight}rem`
            }}
            onClick={() => navigate("/details")}
          >
            <div
              className="p-4 lead shadow grow-sm h-100"
              style={{
                borderRadius: '18px',
                backgroundColor: 'white',
                fontSize: '1.5rem',
                minWidth: '200px',
                transition: 'transform 0.3s ease',
              }}
            >
              <p>{item.description}</p>
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