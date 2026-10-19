import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import OrgDashboard from './pages/OrgDashboard';
import DonationForm from './pages/DonationForm';
import FoodRequestForm from './pages/FoodRequestForm';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'donor' ? '/donor' : user.role === 'ngo' ? '/ngo' : '/org'} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'donor' ? '/donor' : user.role === 'ngo' ? '/ngo' : '/org'} /> : <Register />} />
        <Route path="/donor" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
        <Route path="/ngo" element={<ProtectedRoute role="ngo"><NGODashboard /></ProtectedRoute>} />
        <Route path="/org" element={<ProtectedRoute role="organization"><OrgDashboard /></ProtectedRoute>} />
        <Route path="/donate" element={<ProtectedRoute role="donor"><DonationForm /></ProtectedRoute>} />
        <Route path="/request" element={<ProtectedRoute role="organization"><FoodRequestForm /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
