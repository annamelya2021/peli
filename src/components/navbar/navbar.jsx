import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { searchMovies } from "../../services/api";
import PropTypes from "prop-types";
import "./navbar.css";

const iconGenres = [
  "fas fa-fist-raised",
  "fas fa-hiking",
  "fas fa-film",
  "fas fa-laugh",
  "fas fa-bomb",
  "fas fa-book",
  "fas fa-theater-masks",
  "fas fa-users",
  "fas fa-dragon",
  "fas fa-landmark",
  "fas fa-ghost",
  "fas fa-music",
  "fas fa-search",
  "fas fa-heart",
  "fas fa-rocket",
  "fas fa-tv",
  "fas fa-user-secret",
  "fas fa-bomb",
  "fas fa-hat-cowboy",
];

function getGenresIcons(genres) {
  return genres.map((genre, index) => ({
    id: genre.id,
    name: genre.name,
    className: iconGenres[index] || "fas fa-film",
  }));
}

export const Navbar = ({ setSelectGenres, setSearchResults, genres }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      try {
        const results = await searchMovies(query);
        setSearchResults(results);
        setSelectGenres(null); // Очистити вибраний жанр при пошуку
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleGenreClick = (genreId) => {
    setSelectGenres(genreId);
    setSearchQuery(""); // Очистити пошук при виборі жанру
    setSearchResults([]);
  };

  const genresIcons = getGenresIcons(genres);
  const isHomePage = location.pathname === "/";

  return (
    <nav className="navbar">
      <div
        className={`navbar-links-left ${isMobile ? "mobile" : ""} ${
          menuOpen ? "open" : ""
        }`}
      >
        {isHomePage && (
          <div className="navbar-dropdown">
            <button className="navbar-button">Categorías</button>
            <div className="dropdown-content">
              {genresIcons.map((genre) => (
                <button
                  key={genre.id}
                  className="dropdown-item"
                  onClick={() => handleGenreClick(genre.id)}
                >
                  <i className={genre.className}></i> {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isHomePage && (
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar-button ${isActive ? "active" : ""}`
            }
          >
            Inicio
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `navbar-button ${isActive ? "active" : ""}`
            }
          >
            ⭐Favoritos
          </NavLink>
        )}

        {isHomePage && (
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="navbar-search-input"
            />
          </div>
        )}
      </div>

      <div className="navbar-links-right">
        {isLoggedIn ? (
          <button className="navbar-button login" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="navbar-button login">
            Login
          </NavLink>
        )}
      </div>

      <button
        className="navbar-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        &#9776;
      </button>
    </nav>
  );
};

Navbar.propTypes = {
  setSelectGenres: PropTypes.func.isRequired,
  setSearchResults: PropTypes.func.isRequired,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
