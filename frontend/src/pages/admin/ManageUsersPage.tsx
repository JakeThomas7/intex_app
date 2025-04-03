import { useEffect, useState } from "react";
import { getUsers } from "../../api/UsersAPI"; // Assume updateUserRole is defined
import User from "../../types/User";
import UserTableRow from "../../components/admin/userTableElements/UserTableRow";
import { useAuth } from "../../components/context/AuthContext";
import RoleDropdown from "../../components/admin/userTableElements/RoleDropdown";

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const {user} = useAuth();

  const handleUserDeleted = () => {
    setRefreshKey(prev => prev + 1); // Triggers re-fetch
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshKey]);

  return (
    <div className="section-padding">
      <br/>
      <h3 className="fw-bold py-2">Admin User Management</h3>

      {/* Right Column */}
      <div className="row mb-3">

        {/* Personal Account Card - New Column */}
        <div className="col-12">
          <div className="card shadow-sm fit-content">
            <div className="card-body">
              {user ? (
                <>
                  <>
                  <div className="me-4">
                    <div>
                      <div className="lead">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                    <h5>{user.email}</h5>
                  </div>
                  </>
                  <>
                    <button className='btn btn-primary disabled'>{user.role}</button>
                  </>
                  
                </>
              ) : (
                <div className="text-center py-3">
                  {loading ? "Loading..." : "User data not available"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        
        <div className="col-md-12 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="fw-bold">User List</h4>

            <div className="mb-3" >
              <button className="btn btn-outline-primary me-2 py-4" onClick={() => console.log("Filter: Super Admin")}>
                Super Admin
              </button>
              <button className="btn btn-outline-primary me-2 py-4" onClick={() => console.log("Filter: Admin")}>
                Admin
              </button>
              <button className="btn btn-outline-primary me-2 py-4" onClick={() => console.log("Filter: Normal")}>
                Normal
              </button>
              <button className="btn btn-outline-primary py-4" onClick={() => console.log("Filter: All")}>
                All Users
              </button>
            </div>

            {/* Loading & Error State */}
            {loading && <div className="text-center py-3">Loading users...</div>}
            {error && <div className="text-center text-danger">{error}</div>}

            {/* User Table */}
            {!loading && !error && (
              <table className="table mt-3 text-start text-start w-auto" >
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="gap-2">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <UserTableRow key={user.email} user={user} onUserDeleted={handleUserDeleted} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;