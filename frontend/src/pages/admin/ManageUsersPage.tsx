

const ManageUsersPage = () => {
  return (
    <div className="p-2">
  <h4 className="fw-bold py-2">Admin User Management</h4>
  <div className="row">
    {/* Left Column */}
    <div className="col-md-6">
      {/* Create New User Card */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h4>
            <i className="fa-solid fa-plus me-2"></i>Create new User
          </h4>
          <p>Create a new user account.</p>
          <a href="#" className="btn btn-primary w-100">
            Create User
          </a>
        </div>
      </div>
      </div>

      {/* Manage Account Card */}
      <div className="col-md-6">
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="card-title">Manage My Account</h5>
          <p className="card-text">
            Update your personal account settings here.
          </p>
          <a href="#" className="btn btn-primary w-100">
            Edit Account
          </a>
        </div>
      </div>
      </div>
    <div className="">
    {/* Right Column */}
    <div className="row">
      {/* Filter Buttons */}
      

      {/* Users Table */}
      <div className="card shadow-sm">
        <div className="card-body">
        <div className="mb-3">
        <button className="btn btn-outline-primary me-2" onClick={() => console.log("Filter: Super Admin")}>
          Super Admin
        </button>
        <button className="btn btn-outline-primary me-2" onClick={() => console.log("Filter: Admin")}>
          Admin
        </button>
        <button className="btn btn-outline-primary me-2" onClick={() => console.log("Filter: Normal")}>
          Normal
        </button>
        <button className="btn btn-outline-primary" onClick={() => console.log("Filter: All")}>
          All Users
        </button>
      </div>
          <h4>User List</h4>
          <table className="table table-striped table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample User Data */}
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>johndoe@example.com</td>
                <td>Super Admin</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane Smith</td>
                <td>janesmith@example.com</td>
                <td>Admin</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Bob Johnson</td>
                <td>bobjohnson@example.com</td>
                <td>Normal</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Alice Davis</td>
                <td>alicedavis@example.com</td>
                <td>Admin</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Charlie Brown</td>
                <td>charliebrown@example.com</td>
                <td>Normal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

  )
}

export default ManageUsersPage