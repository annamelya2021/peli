import { useState, useEffect, useRef } from "react";
import { PropTypes } from "prop-types";

function SimpleSlider({ movies }) {
  const visibleCount = 5;
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= movies.length ? 0 : prev + visibleCount
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - visibleCount < 0
        ? Math.max(movies.length - visibleCount, 0)
        : prev - visibleCount
    );
  };

  // Автоматична прокрутка
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // кожні 5 секунд
    return () => clearInterval(interval); // очистка
  }, [movies]);

  const visibleMovies = movies.slice(startIndex, startIndex + visibleCount);

  return (
    <div style={styles.wrapper}>
      <button onClick={prevSlide} style={styles.button}>
        ←
      </button>
      <div style={styles.slider} ref={sliderRef}>
        {visibleMovies.map((movie) => (
          <div key={movie.id} style={styles.card}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={styles.image}
            />
            <h4 style={styles.title}>{movie.title}</h4>
          </div>
        ))}
      </div>
      <button onClick={nextSlide} style={styles.button}>
        →
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "20px",
    maxWidth: "100%",
    overflow: "hidden",
    background: "linear-gradient(to bottom,rgb(132, 123, 71), #fff1b0)",
  },
  slider: {
    display: "flex",
    gap: "10px",
    transition: "transform 0.5s ease-in-out",
  },
  card: {
    width: "180px",
    minWidth: "180px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
  },
  title: {
    fontSize: "0.9rem",
    marginTop: "6px",
    сolor: "white",
  },
  button: {
    fontSize: "2rem",
    background: "none",
    color: "black",
    border: "none",
    cursor: "pointer",
  },
};

SimpleSlider.propTypes = {
  movies: PropTypes.array.isRequired,
};

export default SimpleSlider;
