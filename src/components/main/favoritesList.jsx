import React, { useEffect, useState } from 'react';
import MovieCard from './movieCard';
import './favoritesList.css';

const FavoritesList = ({ genres }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemoveFavorite = (movieId) => {
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (favorites.length === 0) {
    return (
      <div className="no-favorites-container">
        <h2 className="no-favorites-text">No se ha encontrado nada en su favorito </h2>
        <img 
          src="/694e3d940cd7.jpeg" 
          alt="No favorites found"
          className="no-favorites-image"
        />
        
      </div>
    );
  }

  return (
    <div className="favorites-container">
      {favorites.map(movie => (
        <MovieCard key={movie.id} movie={movie} genres={genres} onRemoveFavorite={handleRemoveFavorite} />
      ))}
    </div>
  );
};

export default FavoritesList;
