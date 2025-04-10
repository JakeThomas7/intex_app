import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);


  useEffect(() => {
    // Only show consent banner if cookie preference not set
    if (!Cookies.get('cookie_consent')) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'accepted', { 
      expires: 180, // 6 months
      sameSite: 'Lax'
    });
    setShowConsent(false);
  };

  const handleDeny = () => {
    Cookies.set('cookie_consent', 'denied', { 
      expires: 30, // 1 month
      sameSite: 'Lax'
    });
    // Remove any existing tracking cookies
    Cookies.remove('clicked_movies');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <div className="card shadow-lg border-primary" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h5 className="card-title">We Value Your Privacy</h5>
          <p className="card-text small">
            We use cookies to remember which movies you've shown interest in, 
            helping us suggest content you'll love. You can manage your 
            preferences at any time.
          </p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary flex-grow-1" 
              onClick={handleAccept}
            >
              Accept
            </button>
            <button 
              className="btn btn-outline-secondary flex-grow-1" 
              onClick={handleDeny}
            >
              Deny
            </button>
          </div>
          <p className="text-muted mt-2 me-2 mb-0 small">
            <a href="/privacy" className="text-decoration-none">
              Learn more in our Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;