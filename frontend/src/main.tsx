import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css'
import App from './App';
import Register from './pages/register/register-page';
import RegistrationGuide from './pages/register/RegistrationGuide';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: 'register',
    element: <Register/>
  },
  {
    path: 'registrationguide',
    element: <RegistrationGuide/>
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
