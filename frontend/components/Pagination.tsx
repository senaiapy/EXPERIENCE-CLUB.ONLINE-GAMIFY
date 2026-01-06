import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  // Calculate visible page range
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-1">
        {/* INICIO Button */}
        {showFirstLast && currentPage > 1 && (
          <button
            onClick={() => handlePageClick(1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm shadow-sm"
          >
            INICIO
          </button>
        )}

        {/* Previous Button */}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium text-sm border border-gray-300 shadow-sm"
          >
            Anterior
          </button>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-md transition-colors duration-200 font-medium text-sm shadow-sm ${
              page === currentPage
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium text-sm border border-gray-300 shadow-sm"
          >
            Siguiente
          </button>
        )}

        {/* FINAL Button */}
        {showFirstLast && currentPage < totalPages && (
          <button
            onClick={() => handlePageClick(totalPages)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm shadow-sm"
          >
            FINAL
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;