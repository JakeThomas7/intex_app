import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home/LandingCarousel.css';

interface CarouselProps {
  title?: string;
  cardWidth?: number; // in rem
  cardHeight?: number; // in rem
  data: Array<any>; // Your product data
}

const LandingCarousel = ({
  title = '',
  cardWidth = 19, // Default 19rem
  cardHeight = 19, // Default 19rem
  data,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  return (
    <div className="carousel-section-container">
      <div className="carousel-heading">
        <h1>{title}</h1>
      </div>

      {/* The carousel section */}
      <div className="carousel-section">
        <div
          ref={carouselRef}
          className="d-flex overflow-x-auto pt-2 pb-4 scrollbar-hidden section-padding"
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-2 card-item"
              style={{
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
                  height: `calc(100% - 4px)` // ✅ Gives room for top/bottom border
                }}
              >
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
        </div>
      </div>
    </div>
  );
};

export default LandingCarousel;
