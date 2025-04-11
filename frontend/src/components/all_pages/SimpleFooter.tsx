import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed

const SimpleFooter = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(isAuth ? '/browse' : '/');
  };

  return (
    <div className="section-padding footer-section">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top simple-footer">
        <p className="col-md-4 mb-0">© 2025 CineNiche, Inc</p>
        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item">
            <a className="nav-link px-2" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/Privacy" className="nav-link px-2">Privacy</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default SimpleFooter;
