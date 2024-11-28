import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { WebSocketProvider } from './pages/access/contexts/WebSocketContext';
import { setupAuthInterceptor } from './services/auth.service';

import './index.css'
import App from './App';
import Register from './pages/register/register-page';
import LearnMore from './pages/register/LearnMore';
import Access_IN from './pages/access/access-in';
import Access_OUT from './pages/access/access-out';
import LoginPage from './pages/login/Login';
import VisitorHistory from './pages/dashboard/visitor-history';
import DashboardLayout from './pages/dashboard/DashboardLayout';

setupAuthInterceptor();

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
    path: '/login',
    element: <LoginPage/>
  },
  {
    path: '/login',
    element: <LoginPage/>
  },
  {
    element: <ProtectedRoute allowedRoles={['faculty', 'admin']} />,
    children: [
      {
        path: '/access/in',
        element: <Access_IN/>
      },
      {
        path: '/access/out',
        element: <Access_OUT/>
      },
      {
        path: '/dashboard',
        element: <DashboardLayout />
      },
      {
        path: '/dashboard/visitor-history',
        element: <VisitorHistory/>
      }
    ]
  },
  {
    path: '/unauthorized',
    element: <div>Unauthorized Access</div>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebSocketProvider>
      <RouterProvider router={router}/>
    </WebSocketProvider>
  </StrictMode>
)