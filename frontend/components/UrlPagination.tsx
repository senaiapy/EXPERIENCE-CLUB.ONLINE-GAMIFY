'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from './Pagination';

interface UrlPaginationProps {
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  basePath?: string;
}

const UrlPagination: React.FC<UrlPaginationProps> = ({
  currentPage,
  totalPages,
  searchQuery,
  basePath = '/'
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }

    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    const url = basePath + (params.toString() ? `?${params.toString()}` : '');
    router.push(url);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export default UrlPagination;