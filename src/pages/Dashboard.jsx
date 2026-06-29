import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/authService';
import './Dashboard.css';

function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [meResp, dashResp] = await Promise.all([
        api.get('/auth/me/').catch(() => ({ data: null })),
        api.get('/analytics/dashboard/').catch(() => ({ data: {} })),
      ]);
      setUsuario(meResp.data);
      setResumen(dashResp.data);
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getValor = (key) => {
    if (!resumen) return 0;
    return resumen[key] ?? 0;
  };

  const modulos = [
    {
      icono: '🗺️',
      titulo: 'Mapa en vivo',
      desc: 'Visualizar rutas y buses en tiempo real',
      ruta: '/mapa',
      color: 'azul',
    },
    {
      icono: '🚌',
      titulo: 'Rutas',
      desc: 'Administrar rutas y paradas del sistema',
      ruta: '/rutas',
      color: 'verde',
    },
    {
      icono: '🚐',
      titulo: 'Vehículos',
      desc: 'Gestionar la flota de buses',
      ruta: '/vehiculos',
      color: 'amarillo',
    },
    {
      icono: '⚠️',
      titulo: 'Incidentes',
      desc: 'Reportes y seguimiento de eventos',
      ruta: '/incidentes',
      color: 'rojo',
    },
    {
      icono: '📊',
      titulo: 'Analítica',
      desc: 'KPIs y reportes operativos',
      ruta: '/analytica',
      color: 'azul',
    },
  ];

  const horaActual = new Date().toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const fechaActual = new Date().toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-logo">MoviCore</div>
        <div className="dashboard-header-right">
          {usuario && (
            <div className="dashboard-usuario">
              <span className="dashboard-usuario-saludo">Hola,</span>
              <span className="dashboard-usuario-nombre">
                {usuario.username || usuario.first_name || 'Usuario'}
              </span>
            </div>
          )}
          <button className="btn-secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Bienvenida */}
        <section className="dashboard-bienvenida">
          <div>
            <h1>Panel de control</h1>
            <p className="dashboard-fecha">
              📅 {fechaActual} · 🕐 {horaActual}
            </p>
          </div>
          <div className="dashboard-status-badge">
            <span className="status-dot"></span>
            Sistema operativo
          </div>
        </section>

        {/* Resumen rápido */}
        <section className="dashboard-resumen">
          <div className="resumen-item">
            <div className="resumen-icono">🚐</div>
            <div className="resumen-info">
              <div className="resumen-valor">
                {loading ? '...' : (getValor('vehiculos_activos') || getValor('active_vehicles') || getValor('total_vehicles') || '—')}
              </div>
              <div className="resumen-label">Vehículos activos</div>
            </div>
          </div>

          <div className="resumen-item">
            <div className="resumen-icono">🚌</div>
            <div className="resumen-info">
              <div className="resumen-valor">
                {loading ? '...' : (getValor('viajes_en_curso') || getValor('trips_in_progress') || getValor('trips_today') || '—')}
              </div>
              <div className="resumen-label">Viajes hoy</div>
            </div>
          </div>

          <div className="resumen-item">
            <div className="resumen-icono">🛣️</div>
            <div className="resumen-info">
              <div className="resumen-valor">
                {loading ? '...' : (getValor('rutas_operativas') || getValor('active_routes') || getValor('total_routes') || '—')}
              </div>
              <div className="resumen-label">Rutas operativas</div>
            </div>
          </div>

          <div className="resumen-item">
            <div className="resumen-icono">⚠️</div>
            <div className="resumen-info">
              <div className="resumen-valor">
                {loading ? '...' : (getValor('incidentes_abiertos') || getValor('open_incidents') || '0')}
              </div>
              <div className="resumen-label">Incidentes abiertos</div>
            </div>
          </div>
        </section>

        {/* Módulos */}
        <section>
          <h2 className="dashboard-seccion-titulo">Módulos del sistema</h2>
          <div className="dashboard-modulos">
            {modulos.map((modulo, idx) => (
              <Link key={idx} to={modulo.ruta} className="modulo-card-link">
                <div className={`modulo-card modulo-${modulo.color}`}>
                  <div className="modulo-icono">{modulo.icono}</div>
                  <h3>{modulo.titulo}</h3>
                  <p>{modulo.desc}</p>
                  <div className="modulo-flecha">→</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>MoviCore v1.0 · Sistema de movilidad inteligente para Quito</p>
          <p>Desarrollado por Edison Tanqueño, Yandry Llumiquinga, Alexander Calo</p>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;

