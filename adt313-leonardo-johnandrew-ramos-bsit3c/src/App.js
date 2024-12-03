import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './pages/Main/Main';
import Home from './pages/Main/Movie/Home/Home';
import MovieContextProvider from './context/MovieContext';
import View from './pages/Main/Movie/View/View';
import Login from './pages/Public/Login/Login';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import Register from './pages/Public/Register/Register';
import Cast from './pages/Main/Movie/Cast/Cast';
import UserContextProvider from './context/UserContext';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Mainadmin from './pages/Main/Mainadmin';

const router = createBrowserRouter([

  {
    path: '/login',
    element: <Login />,
  },
  {
   path: '/register',
   element:<Register />
  },
  {
    path: '/main/admin',
    element: < Mainadmin/>,
    children: [
      // Temporarily disabled the dashboard route
      {
        path: '/main/admin/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/main/admin/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/admin/movies',
            element: <Lists />,
          },
          {
            path: '/main/admin/movies/form/:movieId?',
            element: <Form />,
            children: [
              // {
              //   path: '/main/movies/form/:movieId',
              //   element: (
              //     <h1>Change this for cast & crew CRUD functionality.</h1>
              //   ),
              // },
              {
                path: '/main/admin/movies/form/:movieId/cast-and-crews',
                element: (
                
                  <Cast />
                ),
              },
              {
                path: '/main/admin/movies/form/:movieId/photos',
                element: (
                  <h1>Change this for photos CRUD functionality component.</h1>
                ),
              },
              {
                path: '/main/admin/movies/form/:movieId/videos',
                element: (
                  <h1>Change this for videos CRUD functionality component.</h1>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/view/:movieId?',
        element: <View />,
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <UserContextProvider>
      <MovieContextProvider>
        <RouterProvider router={router} />
      </MovieContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
