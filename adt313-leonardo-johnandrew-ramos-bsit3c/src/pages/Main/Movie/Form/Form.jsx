import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Form.css';
import { useNavigate } from 'react-router-dom';
import { eventWrapper } from '@testing-library/user-event/dist/utils';
const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  let { movieId } = useParams();
  const [page, setPage] = useState(1);  // Add current page state
  const [totalPages, setTotalPages] = useState(1); 
   const nav = useNavigate()
  const handleSearch = useCallback(() => {
   

    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YjQzNjY2ZDc0MWFhODBkM2ZlY2NkNDQxZWQ3ZjhiMSIsIm5iZiI6MTcyOTgzNDE0MC41NjI4NDUsInN1YiI6IjY3MWIxNjZjYjNkNWNiYjg0MmYzZmVjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b21GRdLZDQOx5wEwsLW3GyAogWEUd8p_ocPirIvoEpM'
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
          setTotalPages(response.data.total_pages);  
      console.log(response.data.results);
    });
  }, [query, page]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);  
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);  
    }
  };
  

 const handletitlechange =(e) =>{
 setSelectedMovie(m =>({...m , original_title: e.target.value}))
 };
 const handleoverviewchange =(e) =>{
  setSelectedMovie(m =>({...m , overview: e.target.value}))
  }
  useEffect(() => {
      handleSearch();  
    
  },[page])

  useEffect(() =>{
      setPage(1)
  },[query])

  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (selectedMovie === undefined) {
      //add validation
      alert('Please search and select a movie.');
    } else {
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.original_title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
      };
   
     
      const request = axios({
        method: 'post',
        url: '/movies',
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((saveResponse) => {
          console.log(saveResponse);
          alert('Success'); 
           nav('/main/movies')
      
        })
        .catch((error) => console.log(error));
    }
  };


  const handleupdate = () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.original_title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
      };
   
     
      const request = axios({
        method: 'patch',
      url: `/movies/${movieId} `,
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((saveResponse) => {
          console.log(saveResponse);
          alert('Update Sucess'); 
           nav('/main/movies')
        
        })
        .catch((error) => console.log(error));
    
  };

  //create a form change/validation
//create update function 
  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
        console.log(response.data);
        
      });
    } 
   
  }, []);

  return (
    <>
      <h1 className='head2'>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>

      {movieId === undefined && (
        <>
          <div className='search-container' >
            <h6 className='title'> 
              Search Movie:{' '}
            <input
              type='text'
              onChange={(event) => setQuery(event.target.value)}
              />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
              </h6>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p  className='list' onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))
            }
            <div className='page'>
               <button onClick={handlePreviousPage} disabled={page === 1}>
                 Previous
              </button>
               <span className='page'>
              Page {page} of {totalPages}
               </span>
              <button onClick={handleNextPage} disabled={page === totalPages}>
              Next
              </button>
            </div>
              
            </div>
          </div>
          <hr />
        </>
      )}

      <div className='container'>
        <form >
          <div className='image'>
            
          {selectedMovie ? (
            <img
            className='poster-image'
            src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
            
            />
          ) : (
            ''
          )}
          </div>
          <div className='field'>
            Title:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.original_title : ''}
              onChange={handletitlechange}
            />
          </div>
          <div className='field'>
            Overview:
            <textarea
              rows={10}
              value={selectedMovie ? selectedMovie.overview : ''}
              onChange={handleoverviewchange}
            />
          </div>

          <div className='field'>
            Popularity:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.popularity : ''}
            />
          </div>

          <div className='field'>
            Release Date:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.release_date : ''}
            />
          </div>

          <div className='field'>
            Vote Average:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.vote_average : ''}
            />
          </div>

          <button type='button' onClick={movieId? handleupdate: handleSave   }>
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
