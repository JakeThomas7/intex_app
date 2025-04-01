import Account from "../components/account/Account"
import NavBar from "../components/all_pages/Navbar"
import SimpleFooter from "../components/all_pages/SimpleFooter"
import '../styles/AccountPage.css'

const AccountPage = () => {
  return (
    <>
        <NavBar />
        <Account />
        <SimpleFooter />
    </>
  )
}

export default AccountPage