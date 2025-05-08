import React from "react";

const MovieCard = ({
  movie: { title, release_date, vote_average, original_language, poster_path },
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "./no-movie.png"
        }
        alt={title}
      />
      <div className="m-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating gap-2">
            <img src="star.svg" alt="star" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date
              ? ` ${release_date.split("-")[1]}- ${release_date.split("-")[0]}`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
