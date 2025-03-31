import Footer from '../components/all_pages/Footer'
import NavBar from '../components/all_pages/Navbar'
import CardCarousel from '../components/home/CardCarousel'
import CardSection from '../components/home/CardSection'
import FixedImageSection from '../components/home/FixedImageSection'
import ImageSection from '../components/home/ImageSection'
import TitleSection from '../components/home/TitleSection'
import '../styles/home/HomePage.css'

const HomePage = () => {

  return (
    <div>
      <NavBar />
      <TitleSection />
      <CardCarousel />
      <ImageSection />
      <FixedImageSection />
      <CardSection />
      <Footer />
    </div>
  )
}

export default HomePage