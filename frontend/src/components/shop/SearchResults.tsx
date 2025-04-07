import { useNavigate } from "react-router-dom";
import Pagination from "../tabletools/Pagination";
import { useState } from "react";
import DropdownList from "../tabletools/Dropdown";

interface SearchResultsProps {
    // Include Search Parameters
    data: Array<any>; // Your product data
}

const SearchResults = ({
  data
} : SearchResultsProps) => {

    const [numPerPage, setNumPerPage] = useState(8);
    const navigate = useNavigate();

    // Define the options for the dropdown
    const dropdownOptions = [8, 12, 16, 20, 24];
    // Callback function to handle dropdown changes
    const handleDropdownChange = (value: number) => {
        setNumPerPage(value);
    };


  return (
    <div className="section-padding pt-4 pb-4 bg-light">
    <div className="row mb-1">
    <div className="col-md-6 d-flex align-items-center">
    <div>
        Showing 
        <div className="dropdown d-inline mx-2">
        <button
            className="btn btn-primary dropdown-toggle text-white"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            {numPerPage} per page
        </button>
        <DropdownList currentValue={numPerPage} options={dropdownOptions} onChange={handleDropdownChange} label="dropdownMenuButton" />
        </div> 
        of <strong>30</strong>
    </div>
    </div>
        <div className="col-md-6 d-flex justify-content-end">
            <Pagination totalItems={100} itemsPerPage={8} currentPage={4} onPageChange={function (): void {
                throw new Error("Function not implemented.");
            }}/>
        </div>
    </div>

    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 g-3">
        {data.slice(0, numPerPage).map((item, index) => (
        <div
            key={index}
            className="col" // Important - makes each item a grid column
            onClick={() => navigate("/details")}
        >
            <div
            className="p-4 lead shadow h-100"
            style={{
                borderRadius: '18px',
                backgroundColor: 'white',
                fontSize: '1.5rem',
                transition: 'transform 0.3s ease',
            }}
            >
            <p>{item.description}</p>
            </div>
        </div>
        ))}
        </div>
        <div className="row mb-1">
        <div className="col-md-12 d-flex justify-content-end">
            <Pagination totalItems={100} itemsPerPage={8} currentPage={4} onPageChange={function (): void {
                throw new Error("Function not implemented.");
            }}/>
        </div>
    </div>
    </div>
  )
}

export default SearchResults