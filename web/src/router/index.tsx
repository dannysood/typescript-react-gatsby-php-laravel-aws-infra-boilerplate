import { Spinner } from '@vechaiui/react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSanctum } from 'react-sanctum';
import { Dashboard } from '../components/Dashboard';
import { Login } from '../components/Login';
import { NotFound } from '../components/NotFound';
export const MainRouter = () => {

  const { authenticated } = useSanctum();

  if (authenticated == null) {
    return <div className="full-height-custom flex flex-col h-screen justify-center items-center">
      <Spinner size='xl' className="text-primary-500" />
    </div>
  }

  const ProtectedRoute = ({ children }: { children: any }) => {
    if (!authenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Routes>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>

  );
};