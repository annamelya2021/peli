import { useEffect, useState } from "react";
import {
  fetchPopularMovies,
  fetchGenreMovie,
  searchMovies,
} from "../../services/api";
import MovieCard from "./movieCard";
import "./movieList.css";

const MovieList = ({ selectGenres, searchResults, genres }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);

  // Завантаження фільмів при скролі (тільки для популярних)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Завантаження наступної сторінки популярних фільмів
  useEffect(() => {
    const loadMoreMovies = async () => {
      try {
        const data = await fetchPopularMovies(page);
        setMovies((prevMovies) => {
          const existingIds = new Set(prevMovies.map((m) => m.id));
          const newOnes = data.filter((m) => !existingIds.has(m.id));
          return [...prevMovies, ...newOnes];
        });
      } catch (error) {
        console.error("Scroll fetch failed", error);
      }
    };

    if (!isSearching && !selectGenres && page > 1) {
      loadMoreMovies();
    }
  }, [page, isSearching, selectGenres]);

  // Початкове завантаження або при зміні пошуку/жанру
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPage(1); // Скидаємо сторінку

      try {
        if (searchResults && searchResults.length > 0) {
          setMovies(searchResults);
          setIsSearching(true);
        } else if (selectGenres) {
          const movieData = await fetchGenreMovie(selectGenres);
          setMovies(movieData);
          setIsSearching(false);
        } else {
          const movieData = await fetchPopularMovies(1); // перша сторінка
          setMovies(movieData);
          setIsSearching(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchResults, selectGenres]);

  if (loading && movies.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movies-container">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} />
      ))}
      {loading && <div>Loading more...</div>}
    </div>
  );
};

export default MovieList;
