**Movie Explorer**

Movie Explorer is a React application that lets users discover movies, search by title, filter results, and maintain a personal watchlist. It uses a public movie API for live data and offers a modern, responsive UI with detailed movie information and similar recommendations.

**Features**

Discover trending/popular movies on the main page

Search movies by title using a search bar

Filter movies by genre, minimum rating, and release year

View detailed information in a movie modal (poster, overview, rating, year, similar titles)

Add or remove movies from a watchlist

Separate “Discover” and “Watchlist” views managed in React

Responsive design with movie cards and smooth styling

**Tech Stack**

Frontend: React (Create React App)

Styling: CSS (global styles in App.css and index.css)

API Layer: Custom helper functions in util/api.js

State Management: React hooks (useState, useEffect)

Deployment: Vercel

Live Demo
https://movie-explorer-mauve-xi.vercel.app/

https://movie-explorer-git-main-pranav-shalyas-projects.vercel.app/

**Folder Structure**

.
├── public/
├── src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── Watchlist.jsx
│   └── util/
│       └── api.js
├── .env
├── package.json
└── README.md


App.js – main component handling routing between Discover and Watchlist views, search/filter UI, and modal logic.

Watchlist.jsx – dedicated component/page for rendering movies saved to the watchlist.

util/api.js – all API calls and helper functions for fetching movies (trending, search, filters, details, similar).

App.css / index.css – global styling, layout, and theming.

Getting Started
Prerequisites

Node.js and npm

API key from the movie service you are using (e.g., TMDb)

Installation
bash
# Clone the repository
git clone https://github.com/<your-username>/movie-explorer.git
cd movie-explorer

# Install dependencies
npm install
Create a .env file in the project root:

bash
REACT_APP_MOVIE_API_KEY=your_api_key_here
REACT_APP_MOVIE_API_BASE_URL=https://api.themoviedb.org/3
(Use the exact variable names that util/api.js expects.)

Run in development
bash
npm start
Open http://localhost:3000 in your browser.

Build for production
bash
npm run build
Deploy the build folder to Vercel or any static hosting provider.

Core Functionality
Discover view

Fetches trending or popular movies on load (via util/api.js).

Allows searching by movie title and refining results with genre, rating, and year filters.

Renders movies as cards with poster, title, year, and rating.

Clicking a card opens a modal with full details and a list of similar movies.

Watchlist view

Displays all movies marked as “Add to Watchlist”.

Allows removing movies from the watchlist.

Watchlist can be stored in React state plus localStorage to persist between refreshes (if implemented in your app).

Environment & Configuration

Keep API keys and base URLs in .env and never commit them to Git.

When deploying to Vercel, configure the same environment variables in the project settings.

**Future Improvements**

Separate route for each movie (/movie/:id) with a dedicated detail page.

Pagination or infinite scroll for large result sets.

User authentication and a backend (Node/Express + MongoDB) to save watchlists per user.

Dark/light theme toggle and more accessibility improvements.

**License**

This project is intended for learning and portfolio use. You are free to modify and extend it for your own purposes.
