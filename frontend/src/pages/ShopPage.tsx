import { useEffect, useState } from 'react';
import Footer from '../components/all_pages/Footer';
import Navbar from '../components/all_pages/Navbar';
import { useAuth } from '../components/context/AuthContext';
import AllMovies from '../components/shop/AllMovies';
import Carousel from '../components/shop/Carousel';
import SearchResults from '../components/shop/SearchResults';
import { getSimilarUserRecommender } from '../api/RecommenderAPI';

interface CarouselMovie {
  title: string;
  imagePath: string;
  year: number;
  rank: number;
  id: string;
}

const ShopPage = () => {
  const { user } = useAuth();
  console.log(user);
  const [similarUserRecs, setSimilarUserRecs] = useState<CarouselMovie[]>([]);

  // Example placeholder data for existing carousels
  const data = [
    {
      description:
        'Designed for endurance, the Cervélo Caledonia delivers comfort and speed for long-distance rides.',
    },
    {
      description:
        'Lightweight carbon frame ensures a smooth, responsive ride, even on rough terrain.',
    },
    {
      description:
        'Relaxed geometry offers an upright position, perfect for riders prioritizing comfort.',
    },
    {
      description:
        'Wide tire clearance handles everything from smooth roads to gravel paths.',
    },
    {
      description:
        'Shimano Ultegra Di2 electronic shifting guarantees precise and reliable gear changes.',
    },
    {
      description:
        'Aerodynamic design and stable handling inspire confidence on descents and climbs.',
    },
    {
      description:
        'Designed for endurance, the Cervélo Caledonia delivers comfort and speed for long-distance rides.',
    },
    {
      description:
        'Lightweight carbon frame ensures a smooth, responsive ride, even on rough terrain.',
    },
    {
      description:
        'Relaxed geometry offers an upright position, perfect for riders prioritizing comfort.',
    },
    {
      description:
        'Wide tire clearance handles everything from smooth roads to gravel paths.',
    },
    {
      description:
        'Shimano Ultegra Di2 electronic shifting guarantees precise and reliable gear changes.',
    },
    {
      description:
        'Aerodynamic design and stable handling inspire confidence on descents and climbs.',
    },
  ];

  const placeholderId = Math.floor(Math.random() * 200);
  useEffect(() => {
    const fetchUserRecs = async () => {
      if (!placeholderId) return;

      try {
        const recs = await getSimilarUserRecommender(placeholderId);

        const mapped = recs.map((m, idx) => ({
          title: m.title ?? 'Untitled',
          imagePath: m.image_url_suffix
            ? `https://intex2movieposters.blob.core.windows.net/movie-postersv2/${m.image_url_suffix}`
            : 'https://intex2movieposters.blob.core.windows.net/movie-postersv2/NO%20POSTER.jpg',
          year: m.releaseYear ?? 0,
          rank: idx + 1,
          id: m.showId ?? `unknown-${idx}`,
        }));

        setSimilarUserRecs(mapped);
      } catch (error) {
        console.error('Error fetching similar user recommendations:', error);
      }
    };

    fetchUserRecs();
  }, [placeholderId]);

  return (
    <div>
      <Navbar />
      <SearchResults />
      <Carousel
        title={`Similar Users also liked`}
        cardWidth={19}
        cardHeight={19}
        data={similarUserRecs}
      />
      <Carousel
        title="Because you think Spencer Petty is Cute"
        cardWidth={22}
        cardHeight={21}
        data={data}
      />
      <Carousel
        title="Trending Now"
        cardWidth={22}
        cardHeight={21}
        data={data}
      />
      <Carousel
        title="New Arrivals"
        cardWidth={19}
        cardHeight={19}
        data={data}
      />
      <AllMovies />
      <Footer />
    </div>
  );
};

export default ShopPage;
