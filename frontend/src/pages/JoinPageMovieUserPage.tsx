import NavBar from '../components/all_pages/Navbar'
import SimpleFooter from '../components/all_pages/SimpleFooter'
import '../styles/JoinPage.css'
import JoinMovieUserForm from '../components/join/JoinMovieUserForm'

const JoinMovieUserPage = () => {
  return (
    <div>
        <NavBar />
        <JoinMovieUserForm />
        <SimpleFooter />
    </div>
  )
}

export default JoinMovieUserPage