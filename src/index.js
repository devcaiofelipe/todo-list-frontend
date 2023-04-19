import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home'
import Login from './pages/Login'
import Settings from './pages/Settings'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
]);

const globalState = {
  uid: null,
  displayName: 'Anonymous',
  email: 'anonymous@email.com',
  photoURL: '',
  isGoogleAuth: false,
}

export const GlobalContext = React.createContext(globalState);

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  const [contextState, setContextState] = React.useState(globalState);
  return (
    <GlobalContext.Provider value={{ contextState, setContextState }}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </GlobalContext.Provider>
  );
}

root.render(
  <App/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
