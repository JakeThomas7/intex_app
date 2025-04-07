import Footer from '../components/all_pages/Footer'
import NavBar from '../components/all_pages/Navbar'
import RecordSiteTraffic from '../components/all_pages/RecordSiteTraffic'
import ImageSection from '../components/home/ImageSection'
import SiteWidget from '../components/home/SiteWidget'
import TitleSection from '../components/home/TitleSection'
import Carousel from '../components/shop/Carousel'
import '../styles/home/HomePage.css'

const HomePage = () => {

  const carouselData = [
    { description: "Designed for endurance, the Cervélo Caledonia delivers comfort and speed for long-distance rides." },
    { description: "Lightweight carbon frame ensures a smooth, responsive ride, even on rough terrain." },
    { description: "Relaxed geometry offers an upright position, perfect for riders prioritizing comfort." },
    { description: "Wide tire clearance handles everything from smooth roads to gravel paths." },
    { description: "Shimano Ultegra Di2 electronic shifting guarantees precise and reliable gear changes." }
  ]

  return (
    <div>
      <NavBar />
      <TitleSection />
      <SiteWidget />
      <ImageSection />
      <Carousel title="The reason to choose Cervelo. We make a differece" cardHeight={30} cardWidth={30} data={carouselData} />
      {/* <FixedImageSection /> */}
      <Carousel title="Trending Now" cardWidth={22} cardHeight={21} data={carouselData} />
      <Footer />
      <RecordSiteTraffic />
    </div>
  )
}

export default HomePage