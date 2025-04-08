import Footer from "../components/all_pages/Footer";
import NavBar from "../components/all_pages/Navbar";
import PrivacyFAQ from "../components/privacy/PrivacyFAQ";
import PrivacyTitleSection from "../components/privacy/PrivacyTitleSection";
import "../styles/privacy/FAQ.css"; 


function PrivacyPage() {
  return (
    <div className="privacy-gradient-wrapper">
      <NavBar />
      <PrivacyTitleSection />
      <PrivacyFAQ />
      <Footer />
    </div>
  );
}

export default PrivacyPage;