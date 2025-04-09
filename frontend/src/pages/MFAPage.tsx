import NavBar from "../components/all_pages/Navbar"
import SimpleFooter from "../components/all_pages/SimpleFooter"
import MFAForm from "../components/login/MFAForm"

const MFAPage = () => {
  return (
    <div>
      <NavBar />
      <MFAForm />
      <SimpleFooter />
    </div>
  )
}

export default MFAPage