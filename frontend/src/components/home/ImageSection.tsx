import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const ImageSection = () => {
  const navigate = useNavigate();
  const siteWidgetRef = useRef<HTMLDivElement | null>(null);

  const handleStartStreaming = () => {
    navigate('/login');
  };

  return (
    <div className="section-padding image-section" id="imageSection">
      <br />
      <br />
      <h1
        className="display-5 fw-bold"
        style={{
          color: 'white',
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.75)', // just a shadow for visibility
          maxWidth: '100%',
        }}
      >
        Stream Your Next Favorite Show Anytime
      </h1>

      <div className="col-lg-6 mt-4">
        <div className="d-grid gap-2 d-sm-flex">
          <button
            type="button"
            className="btn btn-light text-dark btn-lg px-4 gap-3 grow-sm"
            onClick={handleStartStreaming}
          >
            Start Streaming
          </button>
        </div>
      </div>

      <div ref={siteWidgetRef} id="SiteWidget">
        {/* SiteWidget content goes here */}
      </div>
    </div>
  );
};

export default ImageSection;
