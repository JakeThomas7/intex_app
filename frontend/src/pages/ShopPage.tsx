import Footer from "../components/all_pages/Footer"
import Navbar from "../components/all_pages/Navbar"
import CardCarousel from "../components/home/CardCarousel"
import CardSection from "../components/home/CardSection"

const ShopPage = () => {
  return (
    <div>
        <Navbar />
        <CardCarousel />
        <CardSection />
        <CardCarousel />
        <Footer />
    </div>
  )
}

export default ShopPage