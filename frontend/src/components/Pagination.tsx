import React from 'react';

interface PaginationProps {
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage }) => {
  return (
    <div className="flex justify-center items-center space-x-3 my-6">
      <span
        className={`${
          currentPage === 1 ? 'w-9 rounded-full opacity-70' : 'w-3 opacity-30'
        } h-3 bg-secondary rounded-full transition-all ease-in-out duration-300`}
      />
      <span
        className={`${
          currentPage === 2 ? 'w-8 rounded-full opacity-70' : 'w-3 opacity-30'
        } h-3 bg-secondary rounded-full transition-all ease-in-out duration-300`}
      />
      <span
        className={`${
          currentPage === 3 ? 'w-8 rounded-full opacity-70' : 'w-3 opacity-30'
        } h-3 bg-secondary rounded-full transition-all ease-in-out duration-300`}
      />
    </div>
  );
};

export default Pagination;
