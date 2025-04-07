
interface UserManagementBarProps {
  filters: {
    role: string | undefined;
    search: string;
    //sortBy: string;
    //sortDirection: string;
    pageNum: number;
    pageSize: number;
  };
  onFilterChange: (newFilters: Partial<UserManagementBarProps['filters']>) => void;
}

const UserManagementBar = ({ filters, onFilterChange }: UserManagementBarProps) => {
  const handleSearch = () => {
    onFilterChange({ search: filters.search });
  };

  return (
    <div className="">
      
      {/* Filters Row */}
      <div className="row">
      <div className="col-md-4">
        <button 
          className={`btn me-2 py-3 mb-2 ${filters.role === 'Super Admin' ? 'btn-outline-primary btn-outline-thick' : 'btn-outline-secondary text-black'}`}
          onClick={() => onFilterChange({ 
            role: filters.role === 'Super Admin' ? undefined : 'Super Admin' 
          })}
        >
          Super Admin
        </button>
        <button 
          className={`btn me-2 py-3 mb-2 ${filters.role === 'Admin' ? 'btn-outline-primary btn-outline-thick' : 'btn-outline-secondary text-black'}`}
          onClick={() => onFilterChange({ 
            role: filters.role === 'Admin' ? undefined : 'Admin' 
          })}
        >
          Admin
        </button>
        <button 
          className={`btn py-3 mb-2 ${filters.role === 'User' ? 'btn-outline-primary btn-outline-thick' : 'btn-outline-secondary text-black'}`}
          onClick={() => onFilterChange({ 
            role: filters.role === 'User' ? undefined : 'User' 
          })}
        >
          User
        </button>

      </div>

      <div className="col-sm-8 mb-2">
          <div className="position-relative">
          <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <input 
              className="form-control ps-5" 
              type="text" 
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default UserManagementBar;