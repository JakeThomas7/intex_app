import { useRef, useEffect, useState } from "react";
import '../../styles/home/CardCarousel.css'

const CardCarousel = () => {
  // Sample product data
  const info = [
    { description: "Designed for endurance, the Cervélo Caledonia delivers comfort and speed for long-distance rides." },
    { description: "Lightweight carbon frame ensures a smooth, responsive ride, even on rough terrain." },
    { description: "Relaxed geometry offers an upright position, perfect for riders prioritizing comfort." },
    { description: "Wide tire clearance handles everything from smooth roads to gravel paths." },
    { description: "Shimano Ultegra Di2 electronic shifting guarantees precise and reliable gear changes." },
    { description: "Aerodynamic design and stable handling inspire confidence on descents and climbs." }
  ];

  // Refs for carousel and individual card
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState(0);
  

  // Update card width after component mounts
  useEffect(() => {
    if (carouselRef.current) {
      // Set card width dynamically based on first card
      const firstCard = carouselRef.current.querySelector('.card-item');
      if (firstCard) {
        setCardWidth(firstCard.clientWidth); // Get width of one card
      }
    }
  }, []);

  // Function to scroll the carousel to the left by one card width
  const scrollLeft = () => {
    if (carouselRef.current && cardWidth) {
      carouselRef.current.scrollBy({
        left: -cardWidth, // Scroll by the width of one card
        behavior: 'smooth', // Smooth scroll
      });
    }
  };

  // Function to scroll the carousel to the right by one card width
  const scrollRight = () => {
    if (carouselRef.current && cardWidth) {
      carouselRef.current.scrollBy({
        left: cardWidth, // Scroll by the width of one card
        behavior: 'smooth', // Smooth scroll
      });
    }
  };

  return (
    <div className="carousel-section position-relative">
  <h3 className="section-padding">The Cervélo Caledonia difference. More the reason to train with us.</h3>

  {/* Navigation Buttons */}
  <button 
    onClick={scrollLeft} 
    className="btn btn-light position-absolute top-50 translate-middle-y start-0 ms-3 carousel-controls d-none d-sm-block"
  >
    <i className="fa-solid fa-chevron-left fa-lg px-2 py-4"></i>
  </button>

  {/* Carousel Container */}
  <div
    ref={carouselRef}
    className="d-flex overflow-x-auto py-4 scrollbar-hidden section-padding"
    style={{
      scrollSnapType: 'x mandatory',
      WebkitOverflowScrolling: 'touch',
    }}
  >
    {info.map((i, index) => (
      // Outer container for scroll snap and sizing
      <div
        key={index}
        className="flex-shrink-0 mx-2 card-item"
        style={{
          scrollSnapAlign: 'start',
          scrollMargin: '0 0 0 clamp(3rem, 5vw, 6rem)',
          maxWidth: "25rem",
          height: "20rem"
        }}
      >
        {/* Inner card with hover effect */}
        <div
          className="p-4 lead shadow grow-sm h-100"
          style={{
            borderRadius: '18px',
            backgroundColor: 'white',
            fontSize: '1.5rem',
            transition: 'transform 0.3s ease',
          }}
        >
          <p>{i.description}</p>
        </div>
      </div>
    ))}

    {/* Last spacer */}
    <div style={{ minWidth: '16px', flexShrink: 0 }}></div>
  </div>

  <button 
    onClick={scrollRight} 
    className="btn btn-light position-absolute top-50 translate-middle-y end-0 me-3 carousel-controls d-none d-sm-block"
  >
    <i className="fa-solid fa-chevron-right fa-xl px-2 py-4"></i>
  </button>
</div>
  );
};

export default CardCarousel;