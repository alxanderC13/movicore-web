import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const modulos = [
    { icono: '🗺️', titulo: 'Mapa', desc: 'Ver rutas y paradas en tiempo real', ruta: '/mapa' },
    { icono: '🚌', titulo: 'Rutas', desc: 'Gestionar rutas de transporte', ruta: '/rutas' },
    { icono: '🚐', titulo: 'Vehículos', desc: 'Administrar flota de buses', ruta: '/vehiculos' },
    { icono: '👷', titulo: 'Conductores', desc: 'Registro y asignaciones', ruta: '/conductores' },
    { icono: '⚠️', titulo: 'Incidentes', desc: 'Reportes y seguimiento', ruta: '/incidentes' },
    { icono: '📊', titulo: 'Analítica', desc: 'KPIs y reportes operativos', ruta: '/analytica' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{
          fontSize: '24px',
          background: 'linear-gradient(135deg, #1E5EFF 0%, #19C37D 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          MoviCore
        </h1>
        <button className="btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '8px' }}>Panel de Control</h2>
          <p>Sistema de gestión de transporte urbano de Quito</p>
        </div>

        {/* Grid de módulos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {modulos.map((modulo, idx) => (
            <Link
              key={idx}
              to={modulo.ruta}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                  {modulo.icono}
                </div>
                <h3 style={{ marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                  {modulo.titulo}
                </h3>
                <p style={{ fontSize: '14px' }}>{modulo.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

