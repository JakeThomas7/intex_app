import Footer from "../components/all_pages/Footer"
import Navbar from "../components/all_pages/Navbar"
import { useAuth } from "../components/context/AuthContext"
import AllMovies from "../components/shop/AllMovies"
import Carousel from "../components/shop/Carousel"
import MoviesInfiniteScroll from "../components/shop/MoviesInfiniteScroll"
import SearchResults from "../components/shop/SearchResults"


const ShopPage = () => {

  const {user} = useAuth();

  const data = [
    { description: "Designed for endurance, the Cervélo Caledonia delivers comfort and speed for long-distance rides." },
    { description: "Lightweight carbon frame ensures a smooth, responsive ride, even on rough terrain." },
    { description: "Relaxed geometry offers an upright position, perfect for riders prioritizing comfort." },
    { description: "Wide tire clearance handles everything from smooth roads to gravel paths." },
    { description: "Shimano Ultegra Di2 electronic shifting guarantees precise and reliable gear changes." },
    { description: "Aerodynamic design and stable handling inspire confidence on descents and climbs." },
    { description: "Designed for endurance, the Cervélo Caledonia delivers comfort and speed for long-distance rides." },
    { description: "Lightweight carbon frame ensures a smooth, responsive ride, even on rough terrain." },
    { description: "Relaxed geometry offers an upright position, perfect for riders prioritizing comfort." },
    { description: "Wide tire clearance handles everything from smooth roads to gravel paths." },
    { description: "Shimano Ultegra Di2 electronic shifting guarantees precise and reliable gear changes." },
    { description: "Aerodynamic design and stable handling inspire confidence on descents and climbs." }
  ];
  
  return (
    <div>
        <Navbar />
        <SearchResults />
      <Carousel title={`Recommended for ${user ? user.firstName : "You"}`} cardWidth={19} cardHeight={19} data={data} />
      <Carousel title={`Because you think Spencer Petty is Cute`} cardWidth={22} cardHeight={21} data={data} />
      <Carousel title="Trending Now" cardWidth={22} cardHeight={21} data={data} />
      <Carousel title="New Arrivals" cardWidth={19} cardHeight={19} data={data} />
        <AllMovies />
      <Footer />


    </div>
  )
}

export default ShopPage