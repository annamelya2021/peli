import { useEffect, useState } from "react";
import { fetchGenres } from "../services/api";

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { genres, loading, error };
}
