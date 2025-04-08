import { useEffect, useState } from "react";
import { fetchMovies } from "../../api/MoviesAPI";
import Movie from "../../types/Movie";
import { useNavigate } from "react-router-dom";
import AdminMovieCard from "../../components/admin/adminMoviesPage/AdminMovieCard";
import DropdownList from "../../components/tabletools/Dropdown";
import Pagination from "../../components/tabletools/Pagination";

const AdminHomePage = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [params, setParams] = useState({
    pageSize: 36,
    pageNum: 1,
    search: '',
    categories: []
  })
  const [numMovies, setNumMovies] = useState(0);
  const handleParamsChange = (newFilters: Partial<typeof params>, resetPage = true) => {
    setParams(prev => ({
      ...prev,
      ...newFilters,
      pageNum: resetPage ? 1 : newFilters.pageNum ?? prev.pageNum
    }));
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const handleUserDeleted = () => {
    setRefreshKey(prev => prev + 1); // Triggers re-fetch
  };

  const navigate = useNavigate();
  
  useEffect(() => {
      setLoading(true);
      const getMovies = async () => {
        try {
          const data = await fetchMovies(params);
          setMovies(data.data);
          setNumMovies(data.totalCount);
        } catch (error) {
          console.error("Error fetching headlines:", error);
          setError("Failed to load headlines. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
  
      getMovies();
      
    }, [params, refreshKey])
  
    return (
      <div className="p-4">
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h4 className="fw-bold">Add a New Title</h4>
                <hr />
                <button className="btn btn-outline-primary btn-outline-thick p-5 me-2" onClick={() => navigate('/admin/add/movie')}>
                  <i className="fa-solid fa-plus"></i> Add Movie
                </button>
                <button className="btn btn-outline-primary btn-outline-thick p-5 me-2" onClick={() => navigate('/admin/add/show')}>
                  <i className="fa-solid fa-plus"></i> Add Show
                </button>
                <button className="btn btn-outline-primary btn-outline-thick p-5" onClick={() => navigate('/admin/add/other')}>
                  <i className="fa-solid fa-plus"></i> Add Other
                </button>
              </div>
            </div>
          </div>
        </div>
    
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="fw-bold">Manage Titles</h4>
            <hr />

            <div className="row">
              <div className="col-md-6">
                {/* <GenreSelect2 onChange={(genres) => handleParamsChange({ categories: genres.map(genre => genre.genreId) })} selectedValues={params.categories} /> */}
              </div>
              <div className="col-md-6">
              <div className="position-relative">
                <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input 
                    className="form-control ps-5" 
                    type="text" 
                    placeholder="Search users..."
                    value={params.search}
                    onChange={(e) => handleParamsChange({ search: e.target.value })}
                />

              </div>
              </div>
            </div>
    
            <div className="row">
              <div className="col-lg-6">
                <div className="my-2 d-flex align-items-end">
                  <div>
                    Showing 
                    <div className="dropdown d-inline mx-2">
                      <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        {params.pageSize} per page
                      </button>
                      <DropdownList 
                        currentValue={params.pageSize} 
                        options={[12, 24, 36, 76, 96, 224]} 
                        onChange={(value) => handleParamsChange({ pageSize: Number(value) })} 
                        label="dropdownMenuButton" 
                      />
                    </div> 
                    of <strong>{numMovies}</strong>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 d-flex justify-content-end">
                <Pagination 
                  totalItems={numMovies} 
                  itemsPerPage={params.pageSize} 
                  currentPage={params.pageNum} 
                  onPageChange={(page) => handleParamsChange({ pageNum: page }, false)} 
                />
              </div>
            </div>
    
            {loading && (
              <div className="text-center text-muted py-5">
                <h5>Loading...</h5>
              </div>
            )}
    
            {error && (
              <div className="text-center text-muted py-5">
                <h5>There was an error loading from the database.</h5>
                <p className="mt-2">Please try again later.</p>
              </div>
            )}
    
            {!loading && !error && (
              movies.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-4 g-2">
                  {movies.map((movie) => (
                    <AdminMovieCard movie={movie} onMovieDeleted={handleUserDeleted} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <h5>No Movies found.</h5>
                  <p className="mt-2">Try adjusting your filters.</p>
                </div>
              )
            )}
            <Pagination 
                  totalItems={numMovies} 
                  itemsPerPage={params.pageSize} 
                  currentPage={params.pageNum} 
                  onPageChange={(page) => handleParamsChange({ pageNum: page }, false)} 
                />
          </div>
        </div>
      </div>
    );
  }

export default AdminHomePage