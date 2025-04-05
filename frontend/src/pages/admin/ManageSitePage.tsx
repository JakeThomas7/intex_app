import { useEffect, useState } from "react"
import { fetchHeadlines } from "../../api/HeadlinesAPI";
import Headline from "../../types/Headline";
import SiteTraffic from "../../components/admin/adminSitePage/SiteTraffic";


const ManageSitePage = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headlines, setHeadlines] = useState<Headline[]>([]);

  useEffect(() => {
    setLoading(true);
    const getHeadlines = async () => {
      try {
        const data = await fetchHeadlines();
        setHeadlines(data);
      } catch (error) {
        console.error("Error fetching headlines:", error);
        setError("Failed to load headlines. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    getHeadlines();
  }, [])

  return (
    <div className="p-4">

      <div className="mb-4">
        <SiteTraffic />
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold">Manage Widget</h4>
          <hr/>

          {loading && 
            <div className="text-center text-muted py-5">
              <h5>Loading...</h5>
            </div>
          }
          {error && 
            <div className="text-center text-muted py-5">
              <h5>There was an error loading rom the database.</h5>
              <p className="mt-2">Please try again later.</p>
            </div>
          }

          {!loading && !error && (
            headlines.length > 0 ? (

              <div>
                {headlines.map((headline, index) => (
                  <div key={index} className="card shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{headline.title}</h5>
                      <p className="card-text">{headline.text}</p>
                    </div>
                  </div>
                ))}
              </div> 
              
            ) : (
              <div className="text-center text-muted py-5">
                <h5>No headlines found.</h5>
                <p className="mt-2">Try adding a new headline.</p>
              </div>
            )
          )}
        
        </div>
      </div>
    </div>
  )
}

export default ManageSitePage