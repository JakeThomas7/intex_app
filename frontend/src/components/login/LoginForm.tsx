import { useState } from 'react';
import '../../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../api/UsersAPI';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      await authenticateUser(formData.username, formData.password)
      //localStorage.setItem('authToken', data.token);
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
        <h3>Welcome!<br/>Log in to your personal account.</h3>
        <hr/>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input 
            type="text" 
            className="form-control" 
            id="username" 
            placeholder="Enter your username..." 
            value={formData.username}
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