import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { searchMovies } from "../../services/api";
import PropTypes from "prop-types";
import { BsMoonStars } from "react-icons/bs";
import { RxSun } from "react-icons/rx";

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
  const [isFavoritePage, setIsFavoritePage] = useState(false);
  const [isBusquedaPage, setIsBusquedaPage] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Реф для інпуту пошуку
  const searchInputRef = useRef(null);

  useEffect(() => {
    setIsBusquedaPage(location.pathname === "/busqueda");
  }, [location.pathname]);

  useEffect(() => {
    setIsFavoritePage(location.pathname === "/favorites");
  }, [location.pathname]);

  // Автоматичний фокус на інпуті при переході на /busqueda
  useEffect(() => {
    if (isBusquedaPage && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isBusquedaPage]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    if (isDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

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
            <img
              className="logo"
              src="https://cdn-icons-png.flaticon.com/128/686/686458.png"
              alt="logo"
            />
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
            Populares
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

        {!isBusquedaPage && isLoggedIn && (
          <NavLink
            to="/busqueda"
            className={({ isActive }) =>
              `navbar-button ${isActive ? "active" : ""}`
            }
          >
            Busqeda
          </NavLink>
        )}

        {!isHomePage && !isFavoritePage && (
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Buscar por el nombre de la pelicula..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="navbar-search-input"
              ref={searchInputRef}
            />
          </div>
        )}
      </div>

      <div className="navbar-links-right">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-toggle"
        >
          {isDarkMode ? <BsMoonStars style={{ color: "yellow" }} /> : <RxSun />}
        </button>
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
