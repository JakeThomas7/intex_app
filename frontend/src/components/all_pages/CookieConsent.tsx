import { getFingerprint } from "@thumbmarkjs/thumbmarkjs";
import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    const getFingerprintAsync = async () => {
      const fingerprint = await getFingerprint();

      try{
        const response = await fetch(`https://localhost:5000/Cookies/RecordFingerprint`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify( fingerprint ),
          });
      
          if (!response.ok) {
            throw new Error("There was an unexpected error.");
          }
      } catch (e) {
        console.log(e)
      }
      
    };
  
    getFingerprintAsync(); // Call the async function
  }, []);

  const acceptCookies = () => {
    // Store consent in local storage
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null; // Hide if already accepted

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <div className="card shadow-lg g-primary" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h5 className="card-title">Cookie Consent</h5>
          <p className="card-text">
            We use cookies to improve your experience. By continuing, you accept our use of cookies.
          </p>
          <button className="btn btn-primary text-white w-100 grow-sm" onClick={acceptCookies}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;