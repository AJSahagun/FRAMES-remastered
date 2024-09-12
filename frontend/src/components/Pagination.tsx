import React from 'react';

interface PaginationProps {
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage }) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-6">
      <span
        className={`${
          currentPage === 1 ? 'w-8 rounded-full opacity-100' : 'w-4 opacity-50'
        } h-4 bg-secondary rounded-full transition-all ease-in-out duration-300`}
      />
      <span
        className={`${
          currentPage === 2 ? 'w-8 rounded-full opacity-100' : 'w-4 opacity-50'
        } h-4 bg-secondary rounded-full transition-all ease-in-out duration-300`}
      />
      <span
        className={`${
          currentPage === 3 ? 'w-8 rounded-full opacity-100' : 'w-4 opacity-50'
        } h-4 bg-secondary rounded-full transition-all ease-in-out duration-300`}
      />
    </div>
  );
};

export default Pagination;
