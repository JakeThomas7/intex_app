import Footer from '../components/all_pages/Footer';
import NavBar from '../components/all_pages/Navbar';
import RecordSiteTraffic from '../components/all_pages/RecordSiteTraffic';
// import SimpleFooter from '../components/all_pages/SimpleFooter';
import ImageSection from '../components/home/ImageSection';
import SiteWidget from '../components/home/SiteWidget';
import TitleSection from '../components/home/TitleSection';
import Carousel from '../components/shop/Carousel';
import '../styles/home/HomePage.css';

const HomePage = () => {
  // Updated carousel data with movie posters and details
  const carouselData = [
    {
      title: '1 Chance 2 Dance',
      year: 2021,
      imagePath:
        'https://intex2movieposters.blob.core.windows.net/movie-postersv2/1%20Chance%202%20Dance.jpg', // Use the direct URL here
      rank: 1,
    },
    {
      title: '1 Mile to You',
      year: 2020,
      imagePath:
        'https://intex2movieposters.blob.core.windows.net/movie-postersv2/1%20Mile%20to%20You.jpg', // Update with the correct URL for each image
      rank: 2,
    },
    {
      title: '1BR',
      year: 2023,
      imagePath:
        'https://intex2movieposters.blob.core.windows.net/movie-postersv2/1BR.jpg',
      rank: 3,
    },
    // Add more movies with their correct URLs

    {
      title: '1Oct',
      year: 2021,
      imagePath: '/Posters/1Oct.jpg',
      rank: 4, // Add rank here
    },
    {
      title: '1st Summoning',
      year: 2020,
      imagePath: '/Posters/1st Summoning.jpg',
      rank: 5, // Add rank here
    },
    {
      title: '2 Alone in Paris',
      year: 2023,
      imagePath: '/Posters/2 Alone in Paris.jpg',
      rank: 6, // Add rank here
    },
    {
      title: '2 Hearts',
      year: 2020,
      imagePath: '/Posters/2 Hearts.jpg',
      rank: 7, // Add rank here
    },
    {
      title: '2 Weeks in Lagos',
      year: 2020,
      imagePath: '/Posters/2 Weeks in Lagos.jpg',
      rank: 8, // Add rank here
    },
    {
      title: '2 States',
      year: 2023,
      imagePath: '/Posters/2 States.jpg',
      rank: 9, // Add rank here
    },
    {
      title: '3 Days to Kill',
      year: 2020,
      imagePath: '/Posters/3 Days to Kill.jpg',
      rank: 10, // Add rank here
    },

    // Add more movie data as necessary
  ];

  return (
    <div>
      <NavBar />
      <TitleSection />
      <Carousel
        title="Trending Now"
        cardWidth={22}
        cardHeight={36}
        data={carouselData}
      />
      <SiteWidget />
      <ImageSection />
      <Carousel
        title="The reason to choose CineNiche. We make a difference."
        cardHeight={36}
        cardWidth={22}
        data={carouselData}
      />
      <Footer />
      <RecordSiteTraffic />
    </div>
  );
};

export default HomePage;
