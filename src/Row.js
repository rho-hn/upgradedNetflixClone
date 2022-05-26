import React, { useState, useEffect } from "react";
import axios from "./axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import "./Row.css";
import LoadingSpinner from "./LoadingSpinner";

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [name, setName] = useState("");
  const [voteCount, setVoteCount] = useState("");
  const [overview, setOverview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popularity, setPopularity] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "99%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleClick = (movie) => {
    // console.table(movie?.title)
    setIsLoading(true);
    setName(movie.title);
    setVoteCount(movie.vote_count);
    setOverview(movie.overview);
    setPopularity(movie.popularity);
    if (trailerUrl) {
      setTrailerUrl("");
      setIsLoading(false);
    } else {
      movieTrailer(movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => {
          return (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row_poster ${isLargeRow && "row_posterLarge"}`}
              src={`${base_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />
          );
        })}
      </div>

      <div style={{ padding: "40px" }}>
        {isLoading && <LoadingSpinner />}

        {trailerUrl && <h2 style={{ padding: "10px" }}>{name}</h2>}
        {trailerUrl && (
          <h2 style={{ padding: "10px" }}>Popularity Count: {popularity}</h2>
        )}
        {trailerUrl && (
          <h2 style={{ padding: "10px" }}>Vote Count : {voteCount}</h2>
        )}
        {trailerUrl && (
          <h2 style={{ padding: "10px" }}> Overview: {overview}</h2>
        )}

        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;
