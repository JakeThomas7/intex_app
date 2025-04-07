import { useState } from "react"
import Footer from "../components/all_pages/Footer"
import Navbar from "../components/all_pages/Navbar"
import { useAuth } from "../components/context/AuthContext"
import Carousel from "../components/shop/Carousel"
import SearchResults from "../components/shop/SearchResults"


const ShopPage = () => {

  const {user} = useAuth();

  const categories = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5"
  ];

  // CHANGE THIS FOR THE API FILTERING AND SEARCHING ---------------------------
  const [searching, setSearching] = useState(false)

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
        <div className="bg-dark py-5 text-white text-center">

          <div className="d-flex flex-column align-items-center" onSubmit={(event) => {
            event?.preventDefault();
            setSearching(true);
          }}>
            {/* Search Bar */}
            <form className="position-relative w-75 mb-4">
              <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="search"
                className="form-control form-control-lg ps-5"
                placeholder="Search products, categories, etc."
                aria-label="Search products"
              />
            </form>

            {/* Category Buttons */}
            <div className="w-75">
              <div className="d-flex flex-wrap gap-2 justify-content-start">
                {categories.map((category, index) => (
                  <button 
                    key={index}
                    className="btn btn-outline-light d-flex align-items-center"
                  >
                    {category}
                    <i className="fa-solid fa-chevron-right fa-sm ms-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
      </div>
      
      {searching && <SearchResults data={data} />}
      <Carousel title={`Recommended for ${user ? user.firstName : "You"}`} cardWidth={19} cardHeight={19} data={data} />
      <Carousel title={`Because you think Spencer Petty is Cute`} cardWidth={22} cardHeight={21} data={data} />
      <Carousel title="Trending Now" cardWidth={22} cardHeight={21} data={data} />
      <Carousel title="New Arrivals" cardWidth={19} cardHeight={19} data={data} />

      <Footer />


    </div>
  )
}

export default ShopPage