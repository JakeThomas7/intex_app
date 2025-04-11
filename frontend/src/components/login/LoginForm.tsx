import { useState } from 'react';
import '../../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { login, sendOtp } from '../../api/AuthenticationAPI';
import moviesBackground from '../../assets/Movies.jpg';
import { useAuth } from '../context/AuthContext';




const LoginForm = () => {

  const { checkAuth, isAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle visibility state
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    

    try {
      // 1. First try login
      console.log('LOGGING USER IN')
      await login(formData.email, formData.password, formData.rememberMe);

      await delay(500); // Delay for 500ms before first check
      await checkAuth();
      // console.log('First check - Login is auth', isAuth);

      if (isAuth) {
        navigate('/browse');
        return null;
      }
      
      console.log('SENDING 2 FACTOR AUTH')
      // 2. Only if login succeeds, proceed with OTP flow
      try {
        await sendOtp(formData.email)
      } catch (otpError) {
        // Still navigate even if OTP fails, but show error
        setError((otpError as Error).message);
      }
      
      console.log('REDIRECTING TO MFA')
      // 3. Navigate regardless of OTP success (but only if login succeeded)
      navigate('/mfa', {
        state: { email: formData.email, type: 'login' }
      });
    
    } catch (loginError) {
      setError((loginError as Error).message);
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div
    className="login-section section-padding d-flex justify-content-center align-items-center w-100"
    style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${moviesBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh'
    }}
    >
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="mb-3">Sign In</h3>
        {/* <button className="btn btn-outline-dark w-100 mb-3"><i className="fa-brands fa-google me-2"></i>Continue with Google</button> */}
        <hr/>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="position-relative">
            <i className="fa-regular fa-envelope position-absolute top-50 translate-middle-y ms-3" />
            <input
              type="email"
              className="form-control ps-5 bg-dark"
              id="email"
              placeholder="Enter your email..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="position-relative">
            <i 
              className={`fa-regular ${isPasswordVisible ? "fa-eye" : "fa-eye-slash"} position-absolute top-50 translate-middle-y ms-3 password-toggle`}
              style={{ cursor: "pointer", zIndex: 2 }}
              onClick={togglePasswordVisibility} // Toggle visibility
            />
            <input 
              type={isPasswordVisible ? "text" : "password"} // Dynamically set type
              className="form-control ps-5 bg-dark" 
              id="password" 
              placeholder="Enter your password..." 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 d-flex align-items-center justify-content-center">
          <input
            type="checkbox"
            id="rememberMe"
            className="d-none"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label 
            htmlFor="rememberMe"
            style={{ cursor: 'pointer' }}
            className="d-flex align-items-center gap-2"
          >
            <div 
              className={`transition-all ${formData.rememberMe ? 'text-danger' : 'text-muted'}`}
              style={{ fontSize: '1.2rem' }}
            >
              {formData.rememberMe ? (
                <i className="fas fa-heart beat-animation" />
              ) : (
                <i className="far fa-heart" />
              )}
            </div>
            <span>Remember me</span>
          </label>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary text-white w-100 mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading...
            </>
          ) : (
            'Continue'
          )}
        </button>

        {error && (
          <div className="text-center text-danger">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;