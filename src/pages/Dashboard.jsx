import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1>Dashboard MoviCore</h1>
        <button className="btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      <div className="card">
        <h2>¡Bienvenido! 🎉</h2>
        <p style={{ marginTop: '12px' }}>
          Login exitoso. Esta pantalla todavía está vacía, pero ya estás autenticado.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
