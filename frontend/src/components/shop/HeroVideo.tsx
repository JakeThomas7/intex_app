import '/Users/mjmikes/Downloads/Classes/INTEX2/real-intex/intex_app/frontend/src/styles/HeroVideo.css'; // Import the CSS file

import { useNavigate } from 'react-router-dom';

const HeroVideo = () => {
  const navigate = useNavigate(); // React Router's navigate function for navigation

  const handleSpinReel = () => {
    const randomNumber = Math.floor(Math.random() * 8500) + 1; // Generates a random movie ID
    navigate(`/details/s${randomNumber}`); // Navigate to the random movie page
  };

  return (
    <div className="hero-video-container">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        src="/hero-video2.mp4" // Reference your video stored in the public folder
      />
      <div className="hero-content">
        <div className="hero-text">
          <h2 className="hero-header">
            Looking for Inspiration?
          </h2>
          <p className="hero-text-description">
            Spin the Reel and we will find a movie just for you!
          </p>
          <button
            className="spin-reel-button"
            onClick={handleSpinReel} // Handle the click event
          >
            Spin the Reel!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroVideo;
