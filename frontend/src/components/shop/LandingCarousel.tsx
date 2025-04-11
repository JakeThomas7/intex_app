import { useRef } from 'react';
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
              // onClick={() => navigate(`/details/${item.id}`)}
            >
              <div
                className="shadow grow-sm h-100 position-relative"
                style={{
                  borderRadius: '18px',
                  backgroundColor: 'black',
                  color: 'white',
                  border: '2px solid white',
                  transition: 'transform 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Image takes 85% of card */}
                <div style={{ height: '85%' }}>
                  <img
                    src={item.imagePath}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '10px 10px 0 0',
                    }}
                  />
                </div>

                {/* Text takes 15% of card */}
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
                      fontSize: '1.25rem',
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
                      fontSize: '0.9rem',
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
        </div>
      </div>
    </div>
  );
};

export default LandingCarousel;
