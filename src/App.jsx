import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Mapa from './pages/Mapa';
import Rutas from './pages/Rutas';
import authService from './services/authService';

// Componente que protege las rutas (solo entra si estás logueado)
function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: redirige según si está logueado o no */}
        <Route
          path="/"
          element={
            authService.isAuthenticated()
              ? <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Mapa es público (sin login) - usa endpoints /api/public/ */}
        <Route path="/mapa" element={<Mapa />} />

        {/* Rutas protegidas (requieren login) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rutas"
          element={
            <ProtectedRoute>
              <Rutas />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

