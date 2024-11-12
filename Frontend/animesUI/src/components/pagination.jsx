import { useState } from 'react';

const Pagination = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(currentPage); // Estado para el input

  const getPageButtonStyle = (pageNumber) => {
    return pageNumber === currentPage
      ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center'
      : 'text-blue-500 rounded-full w-8 h-8 flex items-center justify-center';
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setInputValue(pageNumber); // Actualiza el input al cambiar de página
  };

  const goToFirstPage = () => {
    handlePageChange(1);
  };

  const goToLastPage = () => {
    handlePageChange(totalPages);
  };

  const validatePage = (newPage) => {
    const pageNumber = parseInt(newPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      return pageNumber;
    }
    return currentPage; // Si no es válido, retorna la página actual
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={getPageButtonStyle(i)}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="bg-white rounded-full shadow-lg p-4 flex items-center space-x-2">
        {currentPage > 1 && (
          <button
            className="text-gray-400"
            onClick={goToFirstPage}
          >
            &lt;&lt;
          </button>
        )}
        {currentPage > 1 && (
          <button
            className="text-gray-400"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lt;
          </button>
        )}
        {renderPageButtons()}
        {currentPage < totalPages && (
          <button
            className="text-gray-400"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &gt;
          </button>
        )}
        {currentPage < totalPages && (
          <button
            className="text-gray-400"
            onClick={goToLastPage}
          >
            &gt;&gt;
          </button>
        )}
        <span className="text-gray-400">Go to</span>
        <input
          type="text" // Mantener tipo texto
          className="w-12 h-8 rounded-full bg-blue-500 text-white text-center"
          value={inputValue}
          onChange={(e) => {
            // Solo permite números y vacíos
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setInputValue(value); // Actualiza el input solo si es un número
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const newPage = validatePage(inputValue);
              handlePageChange(newPage);
            }
          }}
        />
        <span className="text-gray-400">Page</span>
        <span className="text-gray-400">of {totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;