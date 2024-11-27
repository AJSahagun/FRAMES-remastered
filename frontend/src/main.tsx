import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css'
import App from './App';
import Register from './pages/register/register-page';
import LearnMore from './pages/register/LearnMore';

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
    path: 'learnmore',
    element: <LearnMore/>
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
