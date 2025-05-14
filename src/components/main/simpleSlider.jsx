import { useState, useEffect, useRef, useCallback } from "react";
import { PropTypes } from "prop-types";
import "./simpleSlider.css";

function SimpleSlider({ movies }) {
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef(null);

  function getVisibleCount() {
    if (window.innerWidth <= 767) return 3;
    if (window.innerWidth <= 1024) return 4;
    return 5;
  }

  const handleResize = useCallback(() => {
    setVisibleCount(getVisibleCount());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const nextSlide = useCallback(() => {
    setStartIndex((prev) =>
      prev + visibleCount >= movies.length ? 0 : prev + visibleCount
    );
  }, [movies.length, visibleCount]);

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - visibleCount < 0
        ? Math.max(movies.length - visibleCount, 0)
        : prev - visibleCount
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const visibleMovies = movies.slice(startIndex, startIndex + visibleCount);

  const getCardClassName = (index) => {
    const centerIndex = Math.floor(visibleCount / 2);
    const distance = Math.abs(index - centerIndex);

    if (distance === 0) return "center";
    if (distance === 1) return "adjacent";
    return "far";
  };

  return (
    <div
      style={{
        ...styles.wrapper,
        padding: window.innerWidth <= 767 ? "10px" : "20px",
      }}
    >
      <button onClick={prevSlide} style={styles.button}>
        ←
      </button>
      <div
        style={{
          ...styles.slider,
          gap: window.innerWidth <= 767 ? "5px" : "10px",
        }}
        ref={sliderRef}
      >
        {visibleMovies.map((movie, index) => (
          <div
            key={movie.id}
            style={{
              ...styles.card,
              width: window.innerWidth <= 767 ? "120px" : "180px",
              minWidth: window.innerWidth <= 767 ? "120px" : "180px",
            }}
            className={getCardClassName(index)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={styles.image}
            />
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
    background: "linear-gradient(to bottom, rgb(132, 123, 71), #fff1b0)",
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
    transition: "transform 0.5s ease, opacity 0.5s ease",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "0.9rem",
    marginTop: "6px",
    color: "grey",
  },
  button: {
    fontSize: "2rem",
    background: "none",
    color: "black",
    border: "none",
    cursor: "pointer",
    padding: "0 10px",
  },
};

SimpleSlider.propTypes = {
  movies: PropTypes.array.isRequired,
};

export default SimpleSlider;
