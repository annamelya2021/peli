import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "./components/navbar/navbar.jsx";
import SimpleSlider from "./components/main/simpleSlider";
import PopularList from "./components/main/popularList.jsx";
import BusquedaList from "./components/main/busquedaList.jsx";
import NotFound from "./components/main/notFound.jsx";
import Footer from "./components/footer/footer";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FavoritesList from "./components/main/favoritesList";
import { useGenres } from "./hooks/useGenres";
import { usePopularMovies } from "./hooks/usePopularMovies";

export function AppContent() {
  const location = useLocation();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const { genres } = useGenres();
  const { movies, loading: moviesLoading, error: moviesError } = usePopularMovies(selectedGenre);

  const handleSelectGenres = (genreId) => {
    setSelectedGenre(genreId);
  };

  return (
    <div className="App">
      <Navbar
        setSelectGenres={handleSelectGenres}
        setSearchResults={setSearchResults}
        genres={genres}
      />
      <ToastContainer position="top-center" autoClose={3000} />

      {location.pathname === "/" && (
        <div className="slider-container">
          {moviesLoading ? (
            <div>Loading...</div>
          ) : moviesError ? (
            <div>Error loading movies</div>
          ) : (
            <SimpleSlider movies={movies} />
          )}
        </div>
      )}

      <Routes>
        <Route
          path="/busqueda"
          element={
            <BusquedaList
              selectGenres={selectedGenre}
              searchResults={searchResults}
              genres={genres}
            />
          }
        />
        <Route
          path="/"
          element={
            <PopularList
              selectGenres={selectedGenre}
              searchResults={searchResults}
              genres={genres}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
