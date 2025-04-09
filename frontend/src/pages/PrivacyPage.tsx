import NavBar from "../components/all_pages/Navbar";
import SimpleFooter from "../components/all_pages/SimpleFooter";
import PrivacyFAQ from "../components/privacy/PrivacyFAQ";
import PrivacyTitleSection from "../components/privacy/PrivacyTitleSection";
import "../styles/privacy/FAQ.css"; 


function PrivacyPage() {
  return (
    <div className="privacy-gradient-wrapper">
      <NavBar />
      <PrivacyTitleSection />
      <PrivacyFAQ />
      <SimpleFooter />
    </div>
  );
}

export default PrivacyPage;