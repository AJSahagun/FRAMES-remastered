import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import Register from './pages/register/register-page';
import Access_IN from './pages/access/access-in';
import Access_OUT from './pages/access/access-out';
// import Form from './components/RegistrationForm';

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
    path: '/access/in',
    element: <Access_IN/>
  },
  {
    path: '/access/out',
    element: <Access_OUT/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
