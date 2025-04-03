function PrivacyTitleSection() {
  // Define inline styles
  const containerStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white", // Replace with your preferred color
    textAlign: "center",
    paddingTop: "3rem",
    paddingBottom: "3rem",
  };

  const headerStyle = {
    fontSize: "clamp(3rem, 6vw, 5rem)", // Increased font size
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "white", // Ensure it matches the container text color
  };

  const textStyle = {
    fontSize: "1.4rem", // Increased font size
    color: "white", // No shadow
  };

  const linkStyle = {
    fontSize: "1.2rem", // Increased font size
    textDecoration: "none",
    color: "white", // No shadow
  };

  const mutedTextStyle = {
    color: "#ccc",
    fontSize: "1.1rem", // No shadow
  };

  return (
    <div className="container-fluid" style={containerStyle}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <h1 style={headerStyle}>Privacy Policy</h1>
          <p style={mutedTextStyle}>Updated April 2, 2025</p>
          <p style={textStyle}>
            Our Privacy Policy describes how we collect, use, and share your
            personal data.
          </p>
          <p style={textStyle}>
            In addition to this Privacy Policy, we provide data and privacy
            information embedded in our products for certain features that
            require your personal data. You will be given an opportunity to
            review this product-specific information before using these
            features. You can also view this information at any time in the
            settings of those features or online.
          </p>
          <ul>
            <a href="/privacy/downloads" style={linkStyle}>
              Download a copy of this Privacy Policy
            </a>
            <br></br>
            <a href="/privacy/california" style={linkStyle}>
              Your California Privacy Disclosures
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PrivacyTitleSection;
