import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  maxVisiblePages?: number;
}

const TablePagination: React.FC<PaginationProps> = ({
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 5
}) => {
  const renderPaginationItems = () => {
    const paginationItems = [];

    if (totalPages <= maxVisiblePages) {
      return [...Array(totalPages)].map((_, index) => (
        <PaginationItem key={index}>
          <PaginationLink
            onClick={() => onPageChange(index + 1)}
            isActive={currentPage === index + 1}
            className='hover:text-white'
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    paginationItems.push(
      <PaginationItem key="first">
        <PaginationLink
          className="hover:text-white"
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 2) {
      paginationItems.push(
        <PaginationItem key="start-ellipsis">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            className="hover:text-white"
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 1) {
      paginationItems.push(
        <PaginationItem key="end-ellipsis">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key="last">
        <PaginationLink
          className="hover:text-white"
          onClick={() => onPageChange(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );

    return paginationItems;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
        
        {renderPaginationItems()}
        
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;