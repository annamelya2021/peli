import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../services/api";

export function usePopularMovies(selectedGenre) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPopularMovies(1, selectedGenre)
      .then((results) => setMovies(results))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [selectedGenre]);

  return { movies, loading, error };
}
