import React, { useEffect } from 'react';
import { toggleClass } from '../../components/ThemeUtils/ThemeUtils';
import './Pagination.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  isDarkMode: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  isDarkMode,
}) => {
  useEffect(() => {
    toggleClass('.pagination', 'light', isDarkMode);
  }, [isDarkMode]);

  const leftArrowSrc = isDarkMode
    ? '/src/assets/images/light-left_arrow.png'
    : '/src/assets/images/left_arrow.png';

  const rightArrowSrc = isDarkMode
    ? '/src/assets/images/light-right_arrow.png'
    : '/src/assets/images/right_arrow.png';

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`pagination ${isDarkMode ? 'light' : ''}`}>
      <button
        className={`pagination-button ${isDarkMode ? 'light' : ''}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <img
          className="arrow"
          src={leftArrowSrc}
          alt="left_arrow_pic"
          height={12}
          width={8}
        />
      </button>
      <div className="pages-numbers">
        {pageNumbers.map((pageNumber, index) => (
          <span
            key={index}
            className={`page-number ${page === pageNumber ? 'active' : ''} ${isDarkMode ? 'light' : ''}`}
            onClick={() => {
              if (typeof pageNumber === 'number') {
                onPageChange(pageNumber);
              }
            }}
          >
            {pageNumber}
          </span>
        ))}
      </div>
      <button
        className={`pagination-button ${isDarkMode ? 'light' : ''}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <img src={rightArrowSrc} alt="right_arrow_pic" height={12} width={8} />
      </button>
    </div>
  );
};

export default Pagination;
