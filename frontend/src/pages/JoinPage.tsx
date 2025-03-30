import NavBar from '../components/all_pages/Navbar'
import JoinForm from '../components/join/JoinForm'
import SimpleFooter from '../components/all_pages/SimpleFooter'
import '../styles/JoinPage.css'

const JoinPage = () => {
  return (
    <div>
        <NavBar />
        <JoinForm />
        <SimpleFooter />
    </div>
  )
}

export default JoinPage