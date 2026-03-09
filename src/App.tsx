import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import DashboardPage from './pages/DashboardPage';
import EditProfilePage from './pages/EditProfilePage';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Protected layout wrapper for authenticated routes
const ProtectedLayout = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      { path: '/404', element: <NotFoundPage /> },
    ],
  },
  
  // Protected routes
  {
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/profile/edit', element: <EditProfilePage /> },
      { path: '/product', element: <ProductPage /> },
    ],
  },
  
  // Catch-all redirect
  { path: '*', element: <Navigate to="/404" replace /> },
], { basename: '/my-react-ts' });

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        {/* <div className="min-h-screen p-4 sm:p-6 md:p-8"> */}
          <RouterProvider router={router} />
        {/* </div> */}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
