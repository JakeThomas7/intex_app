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

  return (
    <div className="carousel-section">
      <h3 className="section-padding">The Cervélo Caledonia difference. More the reason to train with us.</h3>
      <div 
        className="d-flex overflow-x-auto py-4 scrollbar-hidden section-padding" 
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      > 
        {info.map((i, index) => (
                    <div  
                        key={index} // Use index to avoid duplicate key warnings
                        className="flex-shrink-0 mx-2 p-4 lead shadow grow-sm card-item"
                        style={{ 
                            scrollSnapAlign: 'start',
                            scrollMargin: '0 0 0 clamp(3rem, 5vw, 6rem)',
                            borderRadius: '18px',
                            backgroundColor: 'white',
                            fontSize: '1.5rem',
                            flexShrink: 1, // Ensure it can shrink
                            flexGrow: 0,   // Prevent from growing
                            flexBasis: 'auto', // Allow flexibility based on content
                        }}
                    >
                        <p>{i.description}</p>
                    </div>
                ))}
        
        {/* Last spacer to align last item with edge */}
        <div style={{ minWidth: '16px', flexShrink: 0 }}></div>
      </div>
    </div>
  );
};

export default CardCarousel;