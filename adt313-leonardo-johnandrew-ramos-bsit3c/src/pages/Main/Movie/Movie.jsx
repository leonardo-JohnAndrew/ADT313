import { Outlet } from 'react-router-dom';

const Movie = () => {
  return (
    <>
      <h1 className='head1'>Movie Page</h1>
      <Outlet />
    </>
  );
};

export default Movie;
