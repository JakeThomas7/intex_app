import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxVisiblePages = 2,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }
  console.log('TOTAL PAGES: ' + totalPages)

  const getVisiblePages = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();

  console.log('VISIBLE PAGES: ' + visiblePages)

  return (
    <div className="text-center my-3">
      <button 
        className="btn pagination-btn btn-outline-secondary text-black text-black mx-1" 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fa-solid fa-chevron-left fa-xs"></i>
      </button>

      {/* Always show first page */}
      {visiblePages[0] > 1 && (
        <>
          <button
            className={`btn mx-1 ${currentPage === 1 ? 'btn-primary text-white' : 'pagination-btn btn-outline-secondary text-black text-black'}`}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            1
          </button>
          {visiblePages[0] > 2 && <span className="mx-1 text-muted">|</span>}
        </>
      )}

      {/* Visible page buttons */}
      {visiblePages.map(page => (
        <button
          key={page}
          className={`btn mx-1 ${currentPage === page ? 'btn-primary text-white' : 'pagination-btn btn-outline-secondary text-black text-black'}`}
          onClick={() => onPageChange(page)}
          //disabled={currentPage === page}
        >
          {page}
        </button>
      ))}

      {/* Always show last page */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="mx-1 text-muted">|</span>}
          <button
            className={`btn mx-1 ${currentPage === totalPages ? 'btn-primary text-white' : 'pagination-btn btn-outline-secondary text-black text-black'}`}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {totalPages}
          </button>
        </>
      )}

      <button 
        className="btn pagination-btn btn-outline-secondary text-black text-black mx-1" 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
          <i className="fa-solid fa-chevron-right fa-xs"></i>
      </button>
    </div>
  );
};

export default Pagination;