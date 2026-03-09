import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';

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
      // { path: '/profile/edit', element: <EditProfilePage /> },
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
