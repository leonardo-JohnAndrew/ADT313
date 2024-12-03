import { Outlet } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';
import { useEffect } from 'react';

const Movie = () => {
  
 
  return (
    <>
      <h1>Movie Page</h1>
      <Outlet />
    </>
  );
};

export default Movie;
