// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FavoritesList from "./components/main/favoritesList";
import Footer from "./components/footer/footer";
import "./App.css";
import { useEffect, useState } from "react";
import { fetchGenres, fetchPopularMovies } from "./services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "./components/navbar/navbar.jsx";
import SimpleSlider from "./components/main/simpleSlider";
import PopularList from "./components/main/popularList.jsx";
import BusquedaList from "./components/main/busquedaList.jsx";

function AppContent() {
  const location = useLocation();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [movies, setMovies] = useState([]);

  const handleSelectGenres = (genreId) => {
    setSelectedGenre(genreId);
  };

  useEffect(() => {
    fetchPopularMovies().then(setMovies);
  }, []);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };
    getGenres();
  }, []);

  return (
    <div className="App">
      <Navbar
        setSelectGenres={handleSelectGenres}
        setSearchResults={setSearchResults}
        genres={genres}
      />
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Слайдер тільки на головній сторінці */}
      {location.pathname === "/" && (
        <div className="slider-container">
          <SimpleSlider movies={movies} />
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
