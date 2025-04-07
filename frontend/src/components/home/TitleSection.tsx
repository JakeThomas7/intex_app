import { useNavigate } from "react-router-dom";

const TitleSection = () => {

  const navigate = useNavigate();

  return (
    <div className="section-padding hero-section">
        <h1>Cervélo <br/>Caledonia</h1>
        <div className="col-lg-6">
        <p className="lead mb-4">Designed for all-day comfort and speed, the Caledonia blends endurance geometry with race-ready performance. Tackle any road with confidence and efficiency.</p>
        <div className="d-grid gap-2 d-sm-flex">
            <button type="button" className="btn btn-primary text-white btn-lg px-4 gap-3 grow" onClick={()=>navigate('/shop')}>Get Started</button>
            <button type="button" className="btn btn-outline-light btn-outline-custom btn-lg px-4 grow" onClick={()=>navigate('/login')}>Log in</button>
        </div>
        </div>
    </div>
  )
}

export default TitleSection