import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchPopularMovies, fetchGenreMovie } from "../../services/api";
import MovieCard from "./movieCard";
import "./movieList.css";

const MovieList = ({ selectGenres, searchResults, genres }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // Додаємо scroll listener
  useEffect(() => {
    const handleScroll = () => {
      console.log("scrolling..."); // перевіряємо
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !isFetching &&
        !isSearching &&
        !selectGenres
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, isSearching, selectGenres]);

  // Завантаження нової сторінки популярних фільмів
  useEffect(() => {
    const loadMoreMovies = async () => {
      setIsFetching(true);
      try {
        const data = await fetchPopularMovies(page);
        setMovies((prevMovies) => {
          const existingIds = new Set(prevMovies.map((m) => m.id));
          const newOnes = data.filter((m) => !existingIds.has(m.id));
          return [...prevMovies, ...newOnes];
        });
      } catch (error) {
        console.error("Scroll fetch failed", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (!isSearching && !selectGenres && page > 1) {
      loadMoreMovies();
    }
  }, [page, isSearching, selectGenres]);

  // Початкове завантаження/оновлення при фільтрах
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPage(1);
      try {
        if (searchResults?.length > 0) {
          setMovies(searchResults);
          setIsSearching(true);
        } else if (selectGenres) {
          const movieData = await fetchGenreMovie(selectGenres);
          setMovies(movieData);
          setIsSearching(false);
        } else {
          const movieData = await fetchPopularMovies(1);
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

  return (
    <div className="movies-container">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} />
      ))}
      {(loading || isFetching) && <div>Loading more...</div>}
    </div>
  );
};

MovieList.propTypes = {
  selectGenres: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  searchResults: PropTypes.array,
  genres: PropTypes.array,
};

export default MovieList;
