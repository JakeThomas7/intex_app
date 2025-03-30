import React from 'react';
import image from '../../assets/cervelo.webp'

const FixedImageSection = () => {
  return (
    <div className="section-padding container-fluid fixed-image-section">
      <div className="row">
        {/* Left column - fixed image */}
        <div className="col-md-8 sticky-image-col">
          <div className="sticky-image-wrapper">
            <img 
              src={image}
              alt="Product showcase"
              className="img-fluid"
            />
          </div>
        </div>
        
        {/* Right column - scrolling content */}
        <div className="col-md-4 content-col">
        <div className="content-section">
            <h2>Engineered for Performance</h2>
            <p className="lead">The Cervélo Caledonia is designed for long-distance endurance rides without sacrificing speed.</p>
        </div>

        <div className="content-section">
            <h2>Comfort Meets Speed</h2>
            <p className="lead">With relaxed geometry and compliance features, the Caledonia delivers comfort on even the roughest roads.</p>
        </div>

        <div className="content-section">
            <h2>Precision Shifting</h2>
            <p className="lead">Equipped with Shimano Ultegra Di2 electronic shifting, experience seamless and reliable gear changes.</p>
        </div>

        <div className="content-section">
            <h2>Versatile Tire Clearance</h2>
            <p className="lead">Wide tire clearance allows you to ride on smooth tarmac or venture onto gravel paths with confidence.</p>
        </div>

        <div className="content-section">
            <h2>Aerodynamic Efficiency</h2>
            <p className="lead">Inspired by Cervélo’s racing heritage, the Caledonia balances aerodynamics and stability for a confident ride.</p>
        </div>
          
          <div className="content-section">
            <button className="btn btn-outline-dark btn-lg">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedImageSection;