const SimpleFooter = () => {
  return (
    <div className="section-padding footer-section">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top simple-footer">
        <p className="col-md-4 mb-0">© 2024 Company, Inc</p>
        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item"><a href="#" className="nav-link px-2">Home</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2">Features</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2">Pricing</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2">FAQs</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2">About</a></li>
        </ul>
      </footer>
    </div>
  );
};



export default SimpleFooter



