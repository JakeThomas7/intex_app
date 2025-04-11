import { useEffect, useState } from "react";
import { fetchHeadlines } from "../../api/HeadlinesAPI";
import Headline from "../../types/Headline";
import image from '../../assets/TV.jpg';
import '../../styles/home/SiteWidget.css'; // Your CSS file
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

const SiteWidget = () => {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const {isAdmin} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getHeadlines = async () => {
      try {
        const data = await fetchHeadlines();
        setHeadlines(data);
      } catch (error) {
        console.error("Error fetching headlines:", error);
      }
    };

    getHeadlines();
  }, []);

  return (
    <div className="section-padding site-widget-container">
      {/* Mobile-first image (shown on small screens) */}
      <div className="mobile-image d-md-none mt-4">
        <img 
          src={image}
          alt="Product showcase"
          className="img-fluid"
          style={{borderRadius: "20px"}}
        />
      </div>

      <div className="row">
        {/* Desktop sticky image (hidden on mobile) */}
        <div className="col-md-7 d-none d-md-block sticky-image-col">
          <div className="sticky-image-wrapper">
            <img 
              src={image}
              alt="Product showcase"
              className="img-fluid"
              style={{borderRadius: "20px"}}
            />
          </div>
        </div>

        {/* Content column - visible on all screens */}
        <div className="col-12 col-md-5 content-col mb-5 mt-4">
          
          {headlines.map((headline, index) => (
            <div className="content-section" key={index}>
              <h2>{headline.title}</h2>
              <p className="lead">{headline.text}</p>
            </div>
          ))}

          {isAdmin && (<button onClick={()=> navigate("/admin/site")} className="btn btn-outline-secondary text-black mb-4">Edit site widget <i className="ms-2 fa-solid fa-up-right-from-square"></i></button>)}
        </div>
      </div>
    </div>
  );
};

export default SiteWidget;