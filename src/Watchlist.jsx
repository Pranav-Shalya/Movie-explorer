import React from 'react';

function Watchlist({ favorites, onOpen }) {
  if (!favorites.length) {
    return <div className="empty">Your watchlist is empty</div>;
  }

  return (
    <main className="movies-grid">
      {favorites.map((movie) => (
        <div
          key={movie.id}
          className="movie-card"
          onClick={() => onOpen(movie)}
        >
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
          )}
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split('-')[0] || 'N/A'}</p>
            <p>⭐ {movie.vote_average?.toFixed(1)}</p>
          </div>
        </div>
      ))}
    </main>
  );
}

export default Watchlist;
