import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css'
import App from './App';
import Register from './pages/register/register-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: 'register',
    element: <Register/>
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
