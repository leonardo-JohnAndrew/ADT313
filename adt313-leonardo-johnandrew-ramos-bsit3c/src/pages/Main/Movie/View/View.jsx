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
          <div className='content' >
              <img src={movie.posterPath} alt="" className="images" />
            <div className='banner'>
           <img src={movie.posterPath} alt="" className='image'   />
              <h1 className='title'>{movie.title}</h1>
            </div>
           
            <div className='overview'>
            <h3>{movie.overview}</h3>
            </div>
      <div className="castandcrew">

            <h1 className='cast'>Cast and Crew</h1>
          {movie.casts && movie.casts.length && (
            <div className='castandcrew-container'> 
              {movie.casts.map((item) => (
                <div
                className="card"
                >
                  <div className="card-content">

            <img src={item.url} alt="cast and crew"  />
            <span> {item.name}</span>
            <span> {item.characterName} </span>
                  </div>
          </div>
        ))}
            </div>
          )}
          </div>
           <div className="video-content">

          <h1 className='videos '>Videos</h1>
          {movie.videos && movie.videos.length && (
            <div className='video-container'>
              {movie.videos.map((item) => (
                <div
                className="card-video"
                >
                  <div  className="card-content"> 

                 <iframe
                    src={`https://www.youtube.com/embed/${item.url}`}
                    title={item.name}  
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                     <span>{item.videoType}</span>
                    </div>
                    
          </div>
        ))}
            </div>
          )}
          </div>
 
           <div className='photos'>

  
          {movie.photos && movie.photos.length && (
            <div>
              <div className='photo-container'> 
              {movie.photos.map((item) => (
                <div
                className="photo-card"
                >
                  <div className="photo-content">

                   <img src={item.url} alt="unavailable photos" />
                    <span>{item.description}</span>
                  </div>
          </div>
        ))}
          </div>
            </div>
          )}
          </div>
          
          </div>
        </>
      )}
    </>
  );
}

export default View;
