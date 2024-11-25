import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css'
import App from './App';
import Register from './pages/register/register-page';
import LearnMore from './pages/register/LearnMore';
import Access_IN from './pages/access/access-in';
import Access_OUT from './pages/access/access-out';
import LoginPage from './pages/login/Login';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: 'learnmore',
    element: <LearnMore/>
  },
  {
    path: 'register',
    element: <Register/>
  },
  {
    path: '/access/in',
    element: <Access_IN/>
  },
  {
    path: '/access/out',
    element: <Access_OUT/>
  },
  {
    path: '/login',
    element: <LoginPage/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
