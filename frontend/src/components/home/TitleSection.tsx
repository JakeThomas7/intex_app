import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TitleSection = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  return (
    <div className="section-padding hero-section">
      <div className="title-content">
        <h1 className="righteous-title">
          Cine<span className="shadow">Niche</span>
        </h1>
        <p
          className="lead mb-4"
          style={{ fontSize: '1.5rem', fontWeight: 500 }}
        >
          Unlock Hidden Stories, Just for You.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-center">
          {!isAuth && (
            <>
              <button
                type="button"
                className="btn btn-primary text-white btn-lg px-4 gap-3 grow"
                onClick={() => navigate('/join')}
              >
                Get Started
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 grow"
                onClick={() => navigate('/login')}
              >
                Log in
              </button>
            </>
          )}

          {isAuth && (
            <>
              <button
                type="button"
                className="btn btn-primary text-white btn-lg px-4 gap-3 grow"
                onClick={() => navigate('/browse')}
              >
                Browse Movies
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 grow"
                onClick={() => navigate('/browse')}
              >
                Trending Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
