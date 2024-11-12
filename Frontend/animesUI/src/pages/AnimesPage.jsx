import { useState, useEffect } from 'react';
import Pagination from "../components/pagination"
import AnimeList from "../components/AnimeList"

const AnimesPage = () => {
  const [animes, setAnimes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Cambia esto según la respuesta de tu API

  const fetchAnimes = async (page) => {
    try {
      const response = await fetch(`http://localhost:1234/api/animes?page=${page}&limit=10`);
      const data = await response.json();
      setAnimes(data.data); // Ajusta según la estructura de tu respuesta de API
      // Actualiza totalPages si tu API devuelve el total de páginas
    } catch (error) {
      console.error('Error fetching anime data:', error);
    }
  };

  useEffect(() => {
    fetchAnimes(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <AnimeList animes={animes} />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default AnimesPage;