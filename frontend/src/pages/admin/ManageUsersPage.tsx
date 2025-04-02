import { useEffect, useState } from "react";
import { getUsers } from "../../api/UsersAPI"; // Assume updateUserRole is defined
import User from "../../types/User";

// const ROLE_OPTIONS = {
//   0: "Normal",
//   1: "Admin",
//   2: "Super Admin"
// };

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  // Handle role change in dropdown
  // const handleRoleChange = async (userId: string, newRole: number) => {
  //   try {
  //     await updateUserRole(userId, newRole); // Make API request to update user role
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user.id === userId ? { ...user, adminStatus: newRole } : user
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating role:", error);
  //     setError("Failed to update user role.");
  //   }
  // };

  return (
    <div className="p-4">
      <h3 className="fw-bold py-2">Admin User Management</h3>

      {/* Right Column */}
      <div className="row">
        <div className="card shadow-sm w-75">
          <div className="card-body">
            <h4 className="fw-bold">User List</h4>

            <div className="mb-3">
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
            {error && <div className="alert alert-danger">{error}</div>}

            {/* User Table */}
            {!loading && !error && (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.email}>
                        <td>
                          <div>
                            <div className="lead">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                          <div>{user.email}</div>
                        </td>

                        {/* Editable Dropdown for Role */}
                        <td>
                          <div className="lead">Super Admin</div>
                          {/* <select
                            className="lead border-0"
                            value={user.adminStatus}
                            // onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                          >
                            {Object.entries(ROLE_OPTIONS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select> */}
                        </td>

                        {/* Delete Icon */}
                        <td>
                          <div>
                            <i className="fa-regular fa-trash-can fa-lg text-danger"></i>
                          </div>
                        </td>
                      </tr>
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
  );
};

export default ManageUsersPage;