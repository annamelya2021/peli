import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchPopularMovies, fetchGenreMovie } from "../../services/api";
import MovieCard from "./movieCard";
import "./busquedaList.css";

const BusquedaList = ({ selectGenres, searchResults = null, genres }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  // Load initial or updated data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        if (searchResults !== null) {
          setMovies(searchResults);
          setHasSearched(true);
        } else if (selectGenres) {
          const movieData = await fetchGenreMovie(selectGenres);
          setMovies(movieData);
          setHasSearched(false);
        } else {
          setMovies([]);
        }
      } catch (err) {
        setError("Error al cargar las películas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchResults, selectGenres]);

  // infinite scroll — залишаємо як є
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !isFetching &&
        !hasSearched &&
        !selectGenres &&
        !error
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasSearched, selectGenres, error]);

  // Load more popular movies
  useEffect(() => {
    const loadMoreMovies = async () => {
      setIsFetching(true);
      try {
        const data = await fetchPopularMovies(page);
        setMovies((prev) => [
          ...prev,
          ...data.filter((movie) => !prev.some((m) => m.id === movie.id)),
        ]);
      } catch {
        setError("Error al cargar más películas");
      } finally {
        setIsFetching(false);
      }
    };

    if (!hasSearched && !selectGenres && page > 1 && !error) {
      loadMoreMovies();
    }
  }, [page, hasSearched, selectGenres, error]);

  return (
    <div className="movies-container">
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : movies.length === 0 && hasSearched ? (
        <div className="no-results">
          <h2>No se han encontrado resultados, inténtalo de nuevo</h2>
          <img src="/peli/694e3d940cd7.jpeg" alt="" />
        </div>
      ) : (
        movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genres} />
        ))
      )}

      {isFetching && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

BusquedaList.propTypes = {
  selectGenres: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  searchResults: PropTypes.array,
  genres: PropTypes.array,
};

export default BusquedaList;
