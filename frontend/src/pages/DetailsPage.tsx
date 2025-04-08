import Navbar from '../components/all_pages/Navbar';
import Footer from '../components/all_pages/Footer';
import Carousel from '../components/shop/Carousel';
import '../styles/DetailsPage.css';
import placeholder from '../assets/sanddust.jpg'; // Make sure this exists

const DetailsPage = () => {
  const data = [
    { description: "Recommended movie 1" },
    { description: "Recommended movie 2" },
    { description: "Recommended movie 3" },
    // Add more mock data
  ];

  return (
    <div>
      <Navbar />
      <div
        className="details-hero"
        style={{
          backgroundImage: ` linear-gradient(to right, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0.2) 70%, rgba(255, 255, 255, 0.1) 100%),
      url(${placeholder})`,
        }}
      >
        <div className="details-overlay container">
          <p className="movie-subinfo">2023 • 2h 12m • PG-13</p>
          <h1 className="movie-title">Movie Title</h1>

          <div className="genre-tags">
            <span className="genre-tag">Action</span>
            <span className="genre-tag">Adventure</span>
          </div>

          <p className="movie-description">
            This is a brief description of the movie. It highlights the plot, themes, and gives viewers a glimpse of what to expect. If the text is long, it should wrap naturally and never exceed the content container.
          </p>

          <div className="movie-actions">
            <button className="btn btn-primary text-white me-3">Watch Now</button>
            <button className="btn btn-outline-light me-3">Add to Favorites</button>
            <button className="btn btn-outline-secondary">
            <i className="fas fa-thumbs-up me-2"></i>Rate
            </button>
          </div>
        </div>
      </div>

      <div className="details-carousels section-padding">
        <Carousel title="More like this" cardWidth={25} cardHeight={21} data={data} />
        <Carousel title="Trending Now" cardWidth={19} cardHeight={19} data={data} />
      </div>

      <Footer />
    </div>
  );
};

export default DetailsPage;




