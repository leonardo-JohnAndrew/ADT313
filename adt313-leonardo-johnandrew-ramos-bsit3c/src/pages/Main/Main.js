import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import { UserContext } from '../../context';

function Main() {
  const {username} = useContext(UserContext)
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);
  return (
    <div className='Main'>
      <div className='container'>  
        <div className='navigation'>
          <ul>
          <li>
              <a href ='/main/profile' className='username'>{username}</a>
            </li>
            <li>
              <a href='/main/dashboard'>Dashboard</a>
            </li>
            <li>
              <a href='/main/movies'>Movies</a>
            </li>
            <li>
              <a href='/main/users'>Users</a>
            </li>
            <li className='logout'>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
