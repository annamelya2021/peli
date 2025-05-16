// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404 - Página no encontrada</h1>
      <p className="not-found-description">
        Lo sentimos, la página que estás buscando no existe o fue movida.
      </p>

      <div className="not-found-buttons">
        <Link to="/" className="not-found-link">
          Ir al Inicio
        </Link>
      </div>

      <img
        src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
        alt="404 Not Found"
        className="not-found-image"
      />
    </div>
  );
};

export default NotFound;
