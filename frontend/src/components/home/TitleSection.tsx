import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TitleSection = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  return (
    <div className="section-padding hero-section">
      <div className="title-content">
        <h1 className="righteous-title">
          Cine<span className=" shadow">Niche</span>
        </h1>
        <p className="lead mb-4">
          Your gateway to curated cinematic treasures. Discover hand-picked cult
          classics, indie masterpieces, international gems, and niche
          documentaries unavailable anywhere else. Personalized recommendations
          bring hidden stories straight to you. Dive into a streaming experience
          designed for true film enthusiasts.
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
