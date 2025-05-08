import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import UpcomingMovie from "./components/UpcomingMovie";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [page, setPage] = useState(1);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (Query = "", page) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = Query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(Query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("failed to get data");
      }

      const data = await response.json();
      console.log(data);

      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to Fetch Data");
        setMovieList([]);
        return;
      }
      if (page === 1) {
        setMovieList(data.results);
      } else {
        setMovieList((prev) => [...prev, ...data.results]);
      }
    } catch (error) {
      console.log(`Error fetching movie : ${error}`);
      setErrorMessage("Error Fetching Movies. Please Try Again later...");
    } finally {
      setIsLoading(false);
    }
  };

  const getUpcomingMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = `${API_BASE_URL}/movie/upcoming`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("failed to get data");
      }

      const data = await response.json();
      console.log(data);

      if (data.Response === "false") {
        setErrorMessage(data.Error || "Failed to Fetch Data");
        setUpcomingMovies([]);
        return;
      }
      setUpcomingMovies(data.results || []);
    } catch (error) {
      console.log(`Error fetching movie : ${error}`);
      setErrorMessage("Error Fetching Movies. Please Try Again later...");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchMovies(debounceSearchTerm);
  // }, [debounceSearchTerm]);

  useEffect(() => {
    getUpcomingMovies();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !isLoading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(debounceSearchTerm, page);
    }
  }, [page]);
  useEffect(() => {
    setPage(1);
    fetchMovies(debounceSearchTerm, 1);
  }, [debounceSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {upcomingMovies && (
          <section className="trending">
            <h2>Upcoming Movies</h2>
            <ul>
              {upcomingMovies.map((movie, index) => (
                <UpcomingMovie key={movie.id} movie={movie} index={index} />
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-9">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
