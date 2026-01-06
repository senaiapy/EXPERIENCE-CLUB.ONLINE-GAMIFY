import React from 'react';
import Link from 'next/link';

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const ServerPagination: React.FC<ServerPaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
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

  const buildUrl = (page: number) => {
    return `${basePath}${page > 1 ? `?page=${page}` : ''}`;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-1">
        {/* INICIO Button */}
        {showFirstLast && currentPage > 1 && (
          <Link
            href={buildUrl(1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm shadow-sm"
          >
            INICIO
          </Link>
        )}

        {/* Previous Button */}
        {currentPage > 1 && (
          <Link
            href={buildUrl(currentPage - 1)}
            className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium text-sm border border-gray-300 shadow-sm"
          >
            Anterior
          </Link>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-md transition-colors duration-200 font-medium text-sm shadow-sm ${
              page === currentPage
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Next Button */}
        {currentPage < totalPages && (
          <Link
            href={buildUrl(currentPage + 1)}
            className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium text-sm border border-gray-300 shadow-sm"
          >
            Siguiente
          </Link>
        )}

        {/* FINAL Button */}
        {showFirstLast && currentPage < totalPages && (
          <Link
            href={buildUrl(totalPages)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm shadow-sm"
          >
            FINAL
          </Link>
        )}
      </div>
    </div>
  );
};

export default ServerPagination;