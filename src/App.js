import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Watchlist from './Watchlist';


const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_KEY;

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('trending'); // 'trending' | 'search'
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('movieExplorerFavorites');
    return stored ? JSON.parse(stored) : [];
  });

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [year, setYear] = useState('');

  const [similar, setSimilar] = useState([]);

  const [trailer, setTrailer] = useState(null);

  const location = useLocation();




  const fetchTrending = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${TMDB_BASE}/trending/movie/week?api_key=${API_KEY}`
      );
      setMovies(data.results);
      setView('trending');
    } catch (error) {
      console.error('Trending fetch failed:', error);
    }
    setLoading(false);
  };

  const searchMovies = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${TMDB_BASE}/search/movie?api_key=${API_KEY}&query=${query}`
      );
      setMovies(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  const isFavorite = (movie) =>
    favorites.some((m) => m.id === movie.id);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem('movieExplorerFavorites', JSON.stringify(next));
      return next;
    });
  };

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(
        `${TMDB_BASE}/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      setGenres(data.genres); // [{id, name}]
    } catch (err) {
      console.error('Genre fetch failed:', err);
    }
  };

  // Apply filters on current movie list
  const filteredMovies = movies.filter((movie) => {
    const ratingOk =
      !minRating || (movie.vote_average || 0) >= minRating;

    const yearOk =
      !year || (movie.release_date || '').startsWith(String(year));

    const genreOk =
      !selectedGenre ||
      (movie.genre_ids || []).includes(Number(selectedGenre));

    return ratingOk && yearOk && genreOk;
  });


//   const openMovie = async (movie) => {
//   setSelectedMovie(movie);
//   setSimilar([]);
//   try {
//     const { data } = await axios.get(
//       `${TMDB_BASE}/movie/${movie.id}/similar?api_key=${API_KEY}&language=en-US&page=1`
//     );
//     setSimilar(data.results || []);
//   } catch (err) {
//     console.error('Similar fetch failed:', err);
//   }
// };
     const openMovie = async (movie) => {
  setSelectedMovie(movie);
  setSimilar([]);
  setTrailer(null);

  try {
    const [similarRes, videosRes] = await Promise.all([
      axios.get(
        `${TMDB_BASE}/movie/${movie.id}/similar?api_key=${API_KEY}&language=en-US&page=1`
      ),
      axios.get(
        `${TMDB_BASE}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
      ),
    ]);

    setSimilar(similarRes.data.results || []);

    const vids = videosRes.data.results || [];
    const t = vids.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    );
    setTrailer(t || null);
  } catch (err) {
    console.error('Details fetch failed:', err);
  }
};



  useEffect(() => {
    fetchTrending();
    fetchGenres();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(search);
    setView('search');
  };

  return (
    <div className="app">
      {/* Modal */}
      {selectedMovie && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedMovie(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>
            <img
              className="modal-backdrop-img"
              src={
                selectedMovie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`
                  : `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
              }
              alt={selectedMovie.title}
            />
            <div className="modal-content">

              <h2>{selectedMovie.title}</h2>


              <p className="modal-meta">
                {selectedMovie.release_date?.split('-')[0] || 'N/A'} · ⭐
                {selectedMovie.vote_average?.toFixed(1)}
              </p>
               
              {trailer && (
                <a
                   href={`https://www.youtube.com/watch?v=${trailer.key}`}
                   target="_blank"
                   rel="noreferrer"
                   className="trailer-btn"
                >
                ▶ Watch trailer
                 </a>
              )}


              <p className="modal-overview">
                {selectedMovie.overview || 'No description available.'}
              </p>

              {similar.length > 0 && (
              <div className="modal-similar">
               <h3>Similar movies</h3>
                 <div className="similar-strip">
                 {similar.slice(0, 10).map((m) => (
                   <div
                     key={m.id}
                     className="similar-card"
                     onClick={() => openMovie(m)}
                    >
                     {m.poster_path && (
                      <img
                       src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                       alt={m.title}
                      />
                      )}
                  <p>{m.title}</p>
                </div>
               ))}
             </div>
           </div>
          )}

            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {/* <header>
        <h1>🎬 Movie Explorer</h1>

        <form onSubmit={handleSearch} className="search-form">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="search-input"
          />
          <button type="submit" disabled={loading}>
            Search
          </button>
        </form>

        <div className="view-toggle">
          <button
            className={view === 'trending' ? 'active' : ''}
            onClick={fetchTrending}
          >
            Trending
          </button>
          <button
            className={view === 'search' ? 'active' : ''}
            onClick={() => {
              setSearch('');
              setView('search');
            }}
          >
            Search
          </button>
        </div> */}

        {/* Filters */}
        {/* <div className="filters">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <label>
            Min rating:
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={minRating}
              onChange={(e) =>
                setMinRating(Number(e.target.value) || 0)
              }
            />
          </label>

          <label>
            Year:
            <input
              type="number"
              min="1900"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </label>
        </div>
      </header> */}

      <header>
  <h1>🎬 Movie Explorer</h1>

  {/* Top nav for routes */}
  <nav className="nav">
    <Link
      to="/"
      className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
    >
      Discover
    </Link>
    <Link
      to="/watchlist"
      className={
        location.pathname === '/watchlist' ? 'nav-link active' : 'nav-link'
      }
    >
      Watchlist
    </Link>
  </nav>

  {/* Only show search + filters on Discover page */}
  {location.pathname === '/' && (
    <>
      <form onSubmit={handleSearch} className="search-form">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      <div className="view-toggle">
        <button
          className={view === 'trending' ? 'active' : ''}
          onClick={fetchTrending}
        >
          Trending
        </button>
        <button
          className={view === 'search' ? 'active' : ''}
          onClick={() => {
            setSearch('');
            setView('search');
          }}
        >
          Search
        </button>
      </div>

      <div className="filters">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <label>
          Min rating:
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={(e) =>
              setMinRating(Number(e.target.value) || 0)
            }
          />
        </label>

        <label>
          Year:
          <input
            type="number"
            min="1900"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
      </div>
    </>
  )}
</header>


      {/* Main movie grid with filters applied */}
      {/* <main className="movies-grid">
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : filteredMovies.length ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => openMovie(movie)}
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
                <button
                  className={`fav-btn ${
                    isFavorite(movie) ? 'fav-active' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(movie);
                  }}
                >
                  {isFavorite(movie)
                    ? '★ In Watchlist'
                    : '☆ Add to Watchlist'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">No movies found</div>
        )}
      </main> */}

      <Routes>
  <Route
    path="/"
    element={
      <main className="movies-grid">
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : filteredMovies.length ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => openMovie(movie)}
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
                <button
                  className={`fav-btn ${
                    isFavorite(movie) ? 'fav-active' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(movie);
                  }}
                >
                  {isFavorite(movie)
                    ? '★ In Watchlist'
                    : '☆ Add to Watchlist'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">No movies found</div>
        )}
      </main>
    }
  />
  <Route
    path="/watchlist"
    element={
      <Watchlist favorites={favorites} onOpen={openMovie} />
    }
  />
</Routes>


      {/* {favorites.length > 0 && (
      <section className="favorites">
        <h2>Your Watchlist</h2>
        <div className="movies-grid">
        {favorites.map((movie) => (
        <div
          key={movie.id}
          className="movie-card"
          onClick={() => setSelectedMovie(movie)}
        >
          {/* same poster/info but without fav button or with fixed '★' */}
        {/* </div>
        ))}
        </div>
      </section> */}
    {/* )} */} 

    </div>
  );
}

export default App;
