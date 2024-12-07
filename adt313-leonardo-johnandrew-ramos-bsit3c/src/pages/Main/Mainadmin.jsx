import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Mainadmin.css';
import { useUserContext } from '../../context/UserContext';

function Mainadmin() {
  const { usertoken ,userInfo} = useUserContext();  // Access token from UserContext
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');  // Remove token from localStorage
    navigate('/login');
  };

  const rolecheck = () => {        //check userrole 
    if (userInfo.role === 'user'){ 
          navigate('/')
     }
}
  useEffect(() => {
    if (!usertoken) {  // If no token in context, log out
      handleLogout();
    }
    rolecheck();

  }, []); 

  return (
    <div className="Mainadmin">
      <div className="admincontainer">
        <div className="adminnavigation">
          <ul>
            <li> {userInfo? userInfo.lastName :"none"}</li>
            <li><a href='/main/admin/dashboard'>Dashboard</a></li>
            <li><a href='/main/admin/movies'>Movies</a></li>
           
            <li className='logout'><a onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
     
      </div>
    </div>
  );
}

export default Mainadmin;
