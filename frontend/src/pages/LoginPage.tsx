import React from 'react'
import NavBar from '../components/all_pages/Navbar'
import Footer from '../components/all_pages/Footer'
import LoginForm from '../components/login/LoginForm'
import SimpleFooter from '../components/all_pages/SimpleFooter'

const LoginPage = () => {
  return (
    <div>
      <NavBar />
      <LoginForm />
      <SimpleFooter />
    </div>
  )
}

export default LoginPage