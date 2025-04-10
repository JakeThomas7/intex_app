import { useEffect, useState } from 'react';
import '../../styles/LoginPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moviesBackground from '../../assets/Movies.jpg';
import { sendOtp, verifyOtp } from '../../api/AuthenticationAPI';

const MFAForm = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {checkAuth, isAuth} = useAuth();

  const location = useLocation();
  const email = location.state.email
  const type = location.state.type
  const handleResendCode = async () => {
    await sendOtp(email);
  };

  useEffect(() => {
    console.log("Checking if verified: ", isAuth);
  
    // Immediate check
    if (isAuth) {
      navigate('/browse');
    } else {
      checkAuth();
    }
  
    // Set up interval for continuous checking
    const intervalId = setInterval(() => {
      console.log("Periodic auth check");
      if (isAuth) {
        navigate('/browse');
      } else {
        checkAuth();
      }
    }, 5000); // Check every 5 seconds (adjust as needed)
  
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [isAuth]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await verifyOtp(email, code);
      await checkAuth();
      if (type === 'join') {
        navigate('/accountsetup');
      } else {
        navigate('/browse');
      }
    } catch (err) {
      setError((err as Error).message);
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
          <label htmlFor="email" className="form-label">Enter the code sent to your email below.</label>
          <div className="position-relative">
            <i className="fa-solid fa-hashtag position-absolute top-50 translate-middle-y ms-3" />
            <input
              type="number"
              className="form-control ps-5 bg-dark"
              id="email"
              placeholder="Enter your email..."
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button type="button" className="btn btn-outline-light w-100 mb-3" onClick={handleResendCode}>
            Resend Code
        </button>
        
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
            'Submit'
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

export default MFAForm;