import { useEffect, useState } from "react";
import { getUsers } from "../../api/UsersAPI";
import User from "../../types/User";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserTableRowCard from "../../components/admin/userTableElements/userTableElementsTest/UserTableRowCard";
import UserManagementBar from "../../components/admin/userTableElements/UserBarManagement";
import DropdownList from "../../components/tabletools/Dropdown";
import Pagination from "../../components/tabletools/PaginationComponent";

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const {user} = useAuth();
  const [numUsers, setNumUsers] = useState(0);

  const handleUserDeleted = () => {
    setRefreshKey(prev => prev + 1); // Triggers re-fetch
  };

  const [filters, setFilters] = useState({
    role: '',
    search: '',
    //sortBy: 'createdAt',
    //sortDirection: 'desc',
    pageNum: 1,
    pageSize: 6
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers({
          role: filters.role,
          pageSize: filters.pageSize,
          pageNum: filters.pageNum,
          //sortBy: filters.sortBy,
          //sortDirection: filters.sortDirection,
          search: filters.search,
          // filters: {
          //   role: filters.role === 'All' ? undefined : [filters.role]
          // }
        });
        setUsers(data.users);
        setNumUsers(data.totalNumUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshKey, filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>, resetPage = true) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      pageNum: resetPage ? 1 : newFilters.pageNum ?? prev.pageNum
    }));
  };


  return (
    <div className="px-4">
      <br/>
      {/* <h3 className="fw-bold py-2">Admin User Management</h3> */}

      {/* Right Column */}
      <div className="row mb-3">

        {/* Personal Account Card - New Column */}
        <div className="col-12">
          <div className="card shadow-sm fit-content p-2">
            <div className="card-body">
              {user ? (
                <>
                  <div>
                  <div className="me-4">
                    <div>
                      <div className="lead">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                    <h5>{user.email}</h5>
                  </div>
                  </div>
                  <div>
                    <button className='btn btn-primary disabled me-2'>{user.role}</button>
                    {/* <button className="btn btn-outline-dark" onClick={() => navigate('/admin/users/account')}>My Account</button> */}
                  </div>
                  
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
        <div className="card shadow-sm py-3">
          <div className="card-body">

            <div className="container-fluid">
            <h4 className= "fw-bold">Manage Users</h4>
            <hr/>

            <UserManagementBar 
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Loading & Error State */}
            {loading && 
              <div className="text-center text-muted py-5">
                <h5>Loading...</h5>
              </div>
            }
            {error && <div className="text-center text-danger">{error}</div>}

            {/* User Table */}
            {!loading && !error && (
  
            users.length > 0 ? (
              <div>
                <div className="my-2">
                  <div>
                    Showing 
                    <div className="dropdown d-inline mx-2">
                    <button
                        className="btn btn-light dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {filters.pageSize} per page
                    </button>
                    <DropdownList currentValue={filters.pageSize} options={[6, 8, 12, 16, 20, 24]} onChange={(value) => handleFilterChange({ pageSize: Number(value) })} label="dropdownMenuButton" />
                    </div> 
                    of <strong>{numUsers}</strong>
                  </div>
                </div>
              <div className={`row row-cols-1 row-cols-md-2 ${filters.pageSize >= 12 ? "row-cols-lg-3" : "row-cols-lg-2"} g-2`}>
                {users.map((user) => (
                  <div className="col" key={user.email}>
                    <UserTableRowCard user={user} onUserDeleted={handleUserDeleted} />
                  </div>
                ))}
              </div>
              <Pagination
                  totalItems={numUsers}
                  itemsPerPage={filters.pageSize}
                  currentPage={filters.pageNum}
                  onPageChange={(page: any) => handleFilterChange({ pageNum: page }, false)}
              />
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <h5>No users found</h5>
                <p className="mt-2">Try adjusting your filters.</p>
              </div>
            )

            )}
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManageUsersPage;