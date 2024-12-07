import './MovieCards.css';
function MovieCards({ movie: movie, onClick }) {
  return (
    <>
      <div 
      
       style={ 
      
        {
          background: `url(${
                movie.backdropPath !==
                'https://image.tmdb.org/t/p/original/undefined'
                  ? movie.backdropPath
                  : movie.posterPath
              }) no-repeat center  `
        }
       }
      className='card' onClick={onClick}>
        <img src={movie.posterPath} />
        <span 
        className='title'>{movie.title}</span>
      </div>
    </>
  );
}

export default MovieCards;
