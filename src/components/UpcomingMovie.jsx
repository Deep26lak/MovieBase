import React from "react";

const UpcomingMovie = ({ movie, index }) => {
  return (
    <div>
      <li>
        <p>{index + 1}</p>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : "./no-movie.png"
          }
          alt=""
        />
      </li>
    </div>
  );
};

export default UpcomingMovie;
