import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import { useUserContext } from '../../context/UserContext';

function Main() {
  // const accessToken = localStorage.getItem('accessToken');
   const {token , setToken} = useUserContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
     setToken('');
     navigate('/login')
  };

  useEffect(() => {
    if (
      token === undefined ||
      token === '' ||
      token === null
    ) {
      handleLogout();
    }
  },[]);
  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a onClick={() => navigate('/')}>Movies</a>
            </li>
            {token ? (
              <li className='logout'>
                <a onClick={handleLogout}>Logout</a>
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => navigate('/login')}>Login</a>
              </li>
            )}
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
