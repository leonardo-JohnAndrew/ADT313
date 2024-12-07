import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import { useUserContext } from '../../context/UserContext';

function Main() {
  // const accessToken = localStorage.getItem('accessToken');
   const {usertoken, userInfo} = useUserContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
     navigate('/login')
  };
  
const rolecheck = () => {
    if (userInfo.role === 'admin'){
          navigate('/main/admin')
     }
}


  useEffect(() => {
    if (!usertoken ){
      handleLogout();
    }
    if(userInfo === null){
      handleLogout();
    }
  rolecheck();
  },[]); //ONCE LNG
     
  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a onClick={() => navigate('/')}>Movies</a>
            </li>
            {/* {JSON.stringify(userInfo)} */}
            {usertoken ? (
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
