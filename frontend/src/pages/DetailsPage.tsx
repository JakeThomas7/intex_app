import Navbar from '../components/all_pages/Navbar'
import Footer from '../components/all_pages/Footer'
import FixedImageSection from '../components/home/FixedImageSection'
import Carousel from '../components/shop/Carousel'
import '../styles/DetailsPage.css'


const DetailsPage = () => {

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
        <FixedImageSection />
        <Carousel title="More like this" cardWidth={25} cardHeight={21} data={data} />
        <Carousel title="Trending Now" cardWidth={19} cardHeight={19} data={data} />
        
        <Footer />
    </div>
  )
}

export default DetailsPage