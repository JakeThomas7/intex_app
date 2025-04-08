import { useNavigate } from "react-router-dom";

const TitleSection = () => {

  const navigate = useNavigate();

  return (
    <div className="section-padding hero-section">
  <div className="title-content">
  <h1 className="righteous-title">CineNiche</h1>
  <p className="lead mb-4">
      Your gateway to curated cinematic treasures. Discover hand-picked cult classics, indie masterpieces, international gems, and niche documentaries unavailable anywhere else. Personalized recommendations bring hidden stories straight to you. Dive into a streaming experience designed for true film enthusiasts.
    </p>
    <div className="d-grid gap-2 d-sm-flex justify-content-center">
      <button
        type="button"
        className="btn btn-primary text-white btn-lg px-4 gap-3 grow"
        onClick={() => navigate('/shop')}
      >
        Get Started
      </button>
      <button
        type="button"
        className="btn btn-outline-light btn-outline-custom btn-lg px-4 grow"
        onClick={() => navigate('/login')}
      >
        Log in
      </button>
    </div>
  </div>
</div>

  )
}

export default TitleSection