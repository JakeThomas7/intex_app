import NavBar from '../components/all_pages/Navbar';
import RecordSiteTraffic from '../components/all_pages/RecordSiteTraffic';
import SimpleFooter from '../components/all_pages/SimpleFooter';
import ImageSection from '../components/home/ImageSection';
// import SimpleFooter from '../components/all_pages/SimpleFooter';
import SiteWidget from '../components/home/SiteWidget';
import TitleSection from '../components/home/TitleSection';
import LandingCarousel from '../components/shop/LandingCarousel';
import '../styles/home/HomePage.css';

const HomePage = () => {
  // Updated carousel data with movie posters and details
 const carouselData = [
   {
     title: 'Dick Johnson Is Dead',
     year: 2020,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Dick%20Johnson%20Is%20Dead.jpg',
     rank: 1,
   },

   {
     title: 'Ganglands',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Ganglands.jpg',
     rank: 3,
   },
   {
     title: 'Jailbirds New Orleans',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Jailbirds%20New%20Orleans.jpg',
     rank: 4,
   },
   {
     title: 'Kota Factory',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Kota%20Factory.jpg',
     rank: 5,
   },
   {
     title: 'Midnight Mass',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Midnight%20Mass.jpg',
     rank: 6,
   },
   {
     title: 'Sankofa',
     year: 1993,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Sankofa.jpg',
     rank: 8,
   },
   {
     title: 'The Great British Baking Show',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/The%20Great%20British%20Baking%20Show.jpg',
     rank: 9,
   },

   {
     title: 'Intrusion',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Intrusion.jpg',
     rank: 11,
   },
   {
     title: 'Jaguar',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Jaguar.jpg',
     rank: 12,
   },
   {
     title: 'Avvai Shanmughi',
     year: 1996,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Avvai%20Shanmughi.jpg',
     rank: 15,
   },
   {
     title: 'Jeans',
     year: 1998,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Jeans.jpg',
     rank: 17,
   },
   {
     title: 'Love on the Spectrum',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Love%20on%20the%20Spectrum.jpg',
     rank: 18,
   },
   {
     title: 'Minsara Kanavu',
     year: 1997,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Minsara%20Kanavu.jpg',
     rank: 19,
   },
   {
     title: 'Grown Ups',
     year: 2010,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Grown%20Ups.jpg',
     rank: 20,
   },
   {
     title: 'Dark Skies',
     year: 2013,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Dark%20Skies.jpg',
     rank: 21,
   },
   {
     title: 'Paranoia',
     year: 2013,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Paranoia.jpg',
     rank: 22,
   },
   {
     title: 'The Haunting of Bly Manor',
     year: 2020,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/The%20Haunting%20of%20Bly%20Manor.jpg',
     rank: 23,
   },
   {
     title: 'Falsa Identidad',
     year: 2018,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Falsa%20identidad.jpg',
     rank: 24,
   },
   {
     title: 'Unorthodox',
     year: 2020,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Unorthodox.jpg',
     rank: 27,
   },
   {
     title: 'Sweet Girl',
     year: 2021,
     imagePath:
       'https://intex2movieposters.blob.core.windows.net/movie-postersv2/Sweet%20Girl.jpg',
     rank: 28,
   }
 ];




  return (
    <div>
      <NavBar />
      <TitleSection />
      <LandingCarousel
        title="Hundreds of Niche Shows"
        cardWidth={22}
        cardHeight={35.9}
        data={carouselData}
      />
      <SiteWidget />
      <ImageSection />
      <SimpleFooter />
      <RecordSiteTraffic />
    </div>
  );
};

export default HomePage;
