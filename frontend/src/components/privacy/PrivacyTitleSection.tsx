function PrivacyTitleSection() {
  // Define inline styles
  const containerStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "white",
    paddingTop: "3rem",
    paddingBottom: "3rem",
  };
  
  
  const headerStyle = {
    fontSize: "clamp(3rem, 6vw, 5rem)",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "white",
    textShadow: "0 0 8px rgba(0, 0, 0, 0.4)", // Soft glow
  };

  const textStyle = {
    fontSize: "1.4rem",
    color: "white",
    marginBottom: "1rem",
  };

  const linkStyle = {
    fontSize: "1.2rem",
    textDecoration: "none",
    color: "white",
  };

  const mutedTextStyle = {
    color: "#ccc",
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
  };

  return (
    <div className="container-fluid d-flex align-items-center" style={containerStyle}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <h1 style={headerStyle}>Privacy Policy</h1>
          <p style={mutedTextStyle}>Updated April 2, 2025</p>
          <p style={textStyle}>
            CineNiche is committed to protecting your personal information as you explore and stream unique films on our platform.
          </p>
          <p style={textStyle}>
            Our Privacy Policy describes how we collect, use, and share your personal data.
          </p>
          <p style={textStyle}>
            In addition to this Privacy Policy, we provide data and privacy information embedded in our products for certain features that require your personal data. You will be given an opportunity to review this product-specific information before using these features. You can also view this information at any time in the settings of those features or online.
          </p>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            <li>
              <a href="/privacy/downloads" style={linkStyle}>
                Download a copy of this Privacy Policy
              </a>
            </li>
            <li className="mt-2">
              <a href="/privacy/california" style={linkStyle}>
                Your California Privacy Disclosures
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PrivacyTitleSection;
