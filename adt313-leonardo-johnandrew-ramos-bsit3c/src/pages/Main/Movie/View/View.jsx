import { useEffect } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './View.css'
import { useUserContext } from '../../../../context/UserContext';
function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          
        })
        .catch((e) => {
          console.log(e);
          navigate('/');
        });
    }
    return () => {};
   
  }, [movieId]);
  return (
    <>
      {movie && (
        <>
          <div>
            <div className='banner'>
           <img src={movie.posterPath} alt="" className='image'   />
              <h1>{movie.title}</h1>
            </div>
            <div className='overview'>
            <h3>{movie.overview}</h3>
            </div>
          </div>

          {movie.casts && movie.casts.length && (
            <div>
              <h1>Cast & Crew</h1>
              {JSON.stringify(movie.casts)}
            </div>
          )}

          {movie.videos && movie.videos.length && (
            <div>
              <h1>Videos</h1>
              {JSON.stringify(movie.videos)}
            </div>
          )}

          {movie.photos && movie.photos.length && (
            <div>
              <h1>Photos</h1>
              {JSON.stringify(movie.photos)}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default View;
