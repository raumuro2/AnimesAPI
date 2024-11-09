import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { Loader2 } from "lucide-react";

const AnimeList = () => {
  const [animes, setAnimes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnimes = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1234/api/animes?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch animes');
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Para debugging
      setAnimes(data.animes || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching animes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Anime List</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animes && animes.length > 0 ? (
              animes.map((anime) => (
                <Card key={anime.id} className="overflow-hidden">
                  {anime.image && (
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/320"; // Imagen placeholder si falla la carga
                      }}
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{anime.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {anime.genres && (
                      <p className="text-sm text-gray-600">
                        Genres: {Array.isArray(anime.genres) ? anime.genres.join(", ") : anime.genres}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No animes found</p>
            )}
          </div>

          <div className="mt-6 flex justify-center items-center gap-4">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimeList;