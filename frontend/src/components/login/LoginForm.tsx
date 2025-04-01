import { useState } from 'react';
import '../../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/AuthenticationAPI';
import { useAuth } from '../context/AuthContext';


const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {checkAuth} = useAuth();

  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password)
      //localStorage.setItem('authToken', data.token);
      await checkAuth();
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-section section-padding d-flex justify-content-center align-items-center w-100">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="mb-3">Welcome!<br/>Log in to your personal account.</h3>
        <button className="btn btn-outline-dark w-100 mb-3"><i className="fa-brands fa-google me-2"></i>Continue with Google</button>
        <hr/>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="text" 
            className="form-control" 
            id="email" 
            placeholder="Enter your email..." 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            placeholder="Enter your password..." 
            value={formData.password}
            onChange={handleChange}
            required
          />
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