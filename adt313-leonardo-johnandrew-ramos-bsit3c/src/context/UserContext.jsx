import { useContext, createContext, useState, useEffect } from 'react';

const UserContext = createContext({});

function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(()=>{
     //retrive user info habang initialization 
       const saveUser =localStorage.getItem('userInfo');
        return saveUser ?JSON.parse(saveUser) : null;
  });
  const [usertoken, setToken] = useState(localStorage.getItem('accessToken') || undefined); // Initialize from localStorage
  
  const [tmdbtoken, setTmdbToken] = useState(
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YjQzNjY2ZDc0MWFhODBkM2ZlY2NkNDQxZWQ3ZjhiMSIsIm5iZiI6MTcyOTgzNDE0MC41NjI4NDUsInN1YiI6IjY3MWIxNjZjYjNkNWNiYjg0MmYzZmVjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b21GRdLZDQOx5wEwsLW3GyAogWEUd8p_ocPirIvoEpM'
  );
 
   useEffect(()=>{
    if(userInfo){
      localStorage.setItem('userInfo',JSON.stringify(userInfo))
    }
   },[userInfo])

 
  useEffect(() => {
    if (usertoken) {
      localStorage.setItem('accessToken', usertoken); 
    }
  }, [usertoken]);

 const login = ( newUserInfo) =>{
  setUserInfo(newUserInfo);
  localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
  // console.log(newUserInfo);
 }

 const logout =() =>{
  setUserInfo(null)
  localStorage.removeItem('userInfo')
 }


  return (
    <UserContext.Provider value={{  logout ,login, userInfo, setUserInfo, usertoken, setToken, tmdbtoken, setTmdbToken }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;

export const useUserContext = () => {
  return useContext(UserContext);
};
