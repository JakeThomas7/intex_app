import { useNavigate } from 'react-router-dom'; // Import the navigate hook
import { useRef } from 'react';

const ImageSection = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  const siteWidgetRef = useRef<HTMLDivElement | null>(null); // Use a ref for SiteWidget

  const handleStartStreaming = () => {
    navigate('/login'); // Redirects to the login page
  };

  return (
    <div className="section-padding image-section" id="imageSection">
      <br />
      <br />
      <h1 className="display-5 fw-bold">
        Stream Your Next Favorite Show Anytime
      </h1>
      <div className="col-lg-6">
        <div className="d-grid gap-2 d-sm-flex">
          <button
            type="button"
            className="btn btn-light text-dark btn-lg px-4 gap-3 grow-sm"
            onClick={handleStartStreaming} // Add onClick to redirect to login page
          >
            Start Streaming
          </button>
        </div>
      </div>

      {/* SiteWidget Section */}
      <div ref={siteWidgetRef} id="SiteWidget">
        {/* SiteWidget content goes here */}
      </div>
    </div>
  );
};

export default ImageSection;
