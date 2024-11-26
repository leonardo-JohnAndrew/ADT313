import { useContext, createContext, useState, useEffect } from 'react';

const UserContext = createContext({ userinfo: [], userToken: undefined });

 function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState([]);
  const [token, setToken] = useState(undefined);


  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;

export const useUserContext = () => {
  const data = useContext(UserContext);
  return data;
};
