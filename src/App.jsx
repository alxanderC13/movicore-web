import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Mapa from './pages/Mapa';
import Rutas from './pages/Rutas';
import Vehiculos from './pages/Vehiculos';
import authService from './services/authService';

function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authService.isAuthenticated()
              ? <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mapa" element={<Mapa />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/rutas" element={<ProtectedRoute><Rutas /></ProtectedRoute>} />
        <Route path="/vehiculos" element={<ProtectedRoute><Vehiculos /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

