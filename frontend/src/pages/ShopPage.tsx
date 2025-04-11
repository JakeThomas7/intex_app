import { useState } from "react"
import Footer from "../components/all_pages/Footer"
import Navbar from "../components/all_pages/Navbar"
import { useAuth } from "../components/context/AuthContext"
import AllMovies from "../components/shop/AllMovies"
import Carousel from "../components/shop/Carousel"
import SearchResults from "../components/shop/SearchResults"
import SimpleFooter from "../components/all_pages/SimpleFooter"


const data = ['1', '2', '3', '4', '5', '6', '7', '8'];

const ShopPage = () => {

  const {user} = useAuth();

  const [isSearching, setIsSearching] = useState(false);
  
  return (
    <div>
        <Navbar />
        <SearchResults isSearching={isSearching} setIsSearching={setIsSearching} />
        {!isSearching && 
          <div>
            <Carousel title={`Recommended for ${user ? user.firstName : "You"}`} cardWidth={19} cardHeight={19} data={data} />
            <Carousel title={`Because you think Spencer Petty is Cute`} cardWidth={22} cardHeight={21} data={data} />
            <Carousel title="Trending Now" cardWidth={22} cardHeight={21} data={data} />
            <Carousel title="New Arrivals" cardWidth={19} cardHeight={19} data={data} />
            <AllMovies />
          </div>
        }
      <SimpleFooter />


    </div>
  )
}

export default ShopPage