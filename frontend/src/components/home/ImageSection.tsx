import React from 'react'

const ImageSection = () => {
  return (
    <div className="section-padding image-section">
        <h1 className="display-5 fw-bold">Ride Fast</h1>
        <div className="col-lg-6">
        <p className="lead mb-4">Designed for all-day comfort and speed, the Caledonia blends endurance geometry with race-ready performance. Tackle any road with confidence and efficiency.</p>
        <div className="d-grid gap-2 d-sm-flex">
            <button type="button" className="btn btn-secondary text-white btn-lg px-4 gap-3 grow">Personal Training</button>
            <button type="button" className="btn btn-secondary text-white btn-lg px-4 gap-3 grow">Our Recommendations</button>
            <button type="button" className="btn btn-secondary text-white btn-lg px-4 gap-3 grow">More</button>
        </div>
        </div>
    </div>
  )
}

export default ImageSection