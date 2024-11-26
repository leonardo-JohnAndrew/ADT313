import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';
import { useUserContext } from '../../../../context/UserContext';
const Form = () => {
  const {token , setToken} = useUserContext();  //nandito ung token  para di ko na iget sa local storage
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [errors , setErrors] = useState({});
  const navigate = useNavigate();
  let { movieId } = useParams();
  const [page, setPage] = useState(1);  // Add current page state
  const [totalPages, setTotalPages] = useState(1); 
  
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
      setPage((prevPage) => prevPage + 1); //pluss 1  
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);   //minuss 1
    }
  };

  const handleSave = () => {
    console.log(token);
    if (selectedMovie === undefined ) {
      //add validation
      alert('Please search and select a movie.');
    } 
    else if (!validateForm()) {
            alert("Please fix the errors before save.");
            return;
            }
    
    else {
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.title,
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
          Authorization: `Bearer ${token}`,
        },
      })
        .then((saveResponse) => {
          console.log(saveResponse);
          alert('Success');
        })
        .catch((error) => console.log(error));
    }
  };

  //create a form change/validation
  const validateForm = () => {
    const errorList = {};
    if (!selectedMovie) errorList.selectedMovie = 'No movie selected.';
    if (!selectedMovie?.original_title) errorList.title = 'Title is required.';
    if (!selectedMovie?.overview) errorList.overview = 'Overview is required.';
    // if (!selectedMovie?.popularity || isNaN(selectedMovie.popularity))
    //   errorList.popularity = 'Popularity must be a valid number.';
    if (!selectedMovie?.release_date)
      errorList.release_date = 'Release date is required.';
         else if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedMovie.release_date)) {
                 errorList.release_date = "Invalid format. Use YYYY-MM-DD.";
                 }
    // if (
    //   !selectedMovie?.vote_average ||
    //   isNaN(selectedMovie.vote_average) ||
    //   selectedMovie.vote_average < 0 ||
    //   selectedMovie.vote_average > 10
    // )
    //   errorList.voteAverage = 'Vote average must be a number between 0 and 10.';
    setErrors(errorList);
   
    return Object.keys(errorList).length === 0;
  
  };
  
   const handletitlechange =(e) =>{
    setSelectedMovie(m =>({...m , original_title: e.target.value}))
    };
   const handleoverviewchange =(e) =>{
     setSelectedMovie(m =>({...m , overview: e.target.value}))
    }
  //  const handlepopularity = (e)=>{
  //    setSelectedMovie(m =>({...m, popularity: e.target.value}))
  //  }
   const handlereleasedate = (e)=>{
    setSelectedMovie(m => ({...m,release_date: e.target.value}))
   }
  
  
  //create a new handler for update
  
  const handleupdate = () => {
    if (!validateForm()) {
      alert("Please fix the errors before updating.");
      return;
    }
  
    console.log(token);
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
          Authorization: `Bearer ${token}`,
        },
      })
        .then((saveResponse) => {
          console.log(saveResponse);
          alert('Update Sucess'); 
           navigate('/main/movies')
        
        })
        .catch((error) => console.log(error));
    
  };
   
  useEffect(() => {
    handleSearch();  //magsesearch sya pagnabago ung page
  
    },[page])
 
   useEffect(() =>{
      setPage(1)     //magrereset ung page number sa 1 pag bago ung query
   },[query])

  useEffect(() => {
    setToken(token);
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
      <h1>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>

      {movieId === undefined && (
        <>
          <div className='search-container'>
            Search Movie:{' '}
            <input
              type='text'
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))} 
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
        <form>
          {selectedMovie ? (
            <img
              className='poster-image'
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
            />
          ) : (
            ''
          )}
          <div className='field'>
            Title:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.original_title : ''}
              onChange ={handletitlechange}
            />
            {errors.title && <span >{errors.title}</span>}
          </div>
          <div className='field'>
            Overview:
            <textarea
              rows={10}
              value={selectedMovie ? selectedMovie.overview : ''}
              onChange={handleoverviewchange}
            />
            {errors.overview}
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
             onChange={handlereleasedate}
            />
            {errors.release_date && <span>{errors.release_date}</span>}
          </div>

          <div className='field'>
            Vote Average:
            <input
              type='text'
              value={selectedMovie ? selectedMovie.vote_average : ''}
            />
          </div>

          <button type='button' onClick={movieId? handleupdate : handleSave}>
            Save
          </button>
        </form>
      </div>
      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <nav>
            <ul className='tabs'>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/cast-and-crews`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/photos`);
                }}
              >
                Photos
              </li>
            </ul>
          </nav>

          <Outlet />
        </div>
      )}
    </>
  );
};

export default Form;
