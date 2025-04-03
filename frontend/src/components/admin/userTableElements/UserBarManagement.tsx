
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
  onRefresh: () => void;
}

const UserManagementBar = ({ filters, onFilterChange, onRefresh }: UserManagementBarProps) => {
  const handleSearch = () => {
    onFilterChange({ search: filters.search });
  };

  return (
    <div className="">
      {/* Filters Row */}
      <div className="row">
      <div className="col-md-6">
        <button 
          className={`btn me-2 py-3 mb-2 ${filters.role === 'Super Admin' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onFilterChange({ 
            role: filters.role === 'Super Admin' ? undefined : 'Super Admin' 
          })}
        >
          Super Admin
        </button>
        <button 
          className={`btn me-2 py-3 mb-2 ${filters.role === 'Admin' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onFilterChange({ 
            role: filters.role === 'Admin' ? undefined : 'Admin' 
          })}
        >
          Admin
        </button>
        <button 
          className={`btn py-3 mb-2 ${filters.role === 'User' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onFilterChange({ 
            role: filters.role === 'User' ? undefined : 'User' 
          })}
        >
          User
        </button>
      </div>
        
        <div className="col-sm-4 mb-2">
          <input 
              className="form-control" 
              type="text" 
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="col-sm-2 mb-2">
          <select 
          className="form-select" 
          value={filters.pageSize}
          onChange={(e) => onFilterChange({ pageSize: Number(e.target.value) })}
          style={{ width: 'auto' }}
          >
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserManagementBar;