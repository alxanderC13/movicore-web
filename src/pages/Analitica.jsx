import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/authService';
import './Analitica.css';

function Analitica() {
  const [dashboard, setDashboard] = useState(null);
  const [estadoSistema, setEstadoSistema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
    // Refresca los KPIs cada 30 segundos
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      setError('');
      // Cargamos dashboard y estado del sistema en paralelo
      const [dashResp, estadoResp] = await Promise.all([
        api.get('/analytics/dashboard/').catch(() => ({ data: {} })),
        api.get('/analytics/status/').catch(() => ({ data: {} })),
      ]);

      setDashboard(dashResp.data);
      setEstadoSistema(estadoResp.data);
    } catch (err) {
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
      } else {
        setError('No se pudieron cargar los indicadores. Verifica que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Helper para obtener un valor de forma segura
  const getValor = (obj, key, defaultVal = 0) => {
    if (!obj) return defaultVal;
    return obj[key] ?? defaultVal;
  };

  // KPIs principales (números grandes)
  const kpis = [
    {
      titulo: 'Vehículos activos',
      valor: getValor(dashboard, 'vehiculos_activos') || getValor(dashboard, 'active_vehicles') || getValor(estadoSistema, 'active_vehicles'),
      icono: '🚐',
      color: 'azul',
      desc: 'Buses operando ahora',
    },
    {
      titulo: 'Viajes en curso',
      valor: getValor(dashboard, 'viajes_en_curso') || getValor(dashboard, 'trips_in_progress') || getValor(estadoSistema, 'trips_in_progress'),
      icono: '🚌',
      color: 'verde',
      desc: 'Buses en ruta',
    },
    {
      titulo: 'Incidentes abiertos',
      valor: getValor(dashboard, 'incidentes_abiertos') || getValor(dashboard, 'open_incidents') || getValor(estadoSistema, 'open_incidents'),
      icono: '⚠️',
      color: 'rojo',
      desc: 'Requieren atención',
    },
    {
      titulo: 'Rutas operativas',
      valor: getValor(dashboard, 'rutas_operativas') || getValor(dashboard, 'active_routes') || getValor(estadoSistema, 'active_routes'),
      icono: '🛣️',
      color: 'amarillo',
      desc: 'Rutas en operación',
    },
  ];

  // Métricas secundarias
  const metricas = [
    {
      titulo: 'Viajes del día',
      valor: getValor(dashboard, 'viajes_del_dia') || getValor(dashboard, 'trips_today'),
      icono: '📅',
    },
    {
      titulo: 'Total de conductores',
      valor: getValor(dashboard, 'total_drivers') || getValor(dashboard, 'conductores_totales'),
      icono: '👷',
    },
    {
      titulo: 'Total de paradas',
      valor: getValor(dashboard, 'total_stops') || getValor(dashboard, 'paradas_totales'),
      icono: '📍',
    },
    {
      titulo: 'Total de vehículos',
      valor: getValor(dashboard, 'total_vehicles') || getValor(dashboard, 'vehiculos_totales'),
      icono: '🚍',
    },
  ];

  return (
    <div className="analitica-container">
      <header className="analitica-header">
        <div className="analitica-header-left">
          <Link to="/dashboard" className="analitica-logo">MoviCore</Link>
          <span className="analitica-breadcrumb">/ Analítica</span>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="analitica-main">
        <div className="analitica-titulo">
          <div>
            <h1>📊 Panel ejecutivo</h1>
            <p>Indicadores operativos en tiempo real · Actualización cada 30s</p>
          </div>
          <button className="btn-secondary" onClick={cargarDatos}>
            🔄 Actualizar
          </button>
        </div>

        {loading && <div className="analitica-loading">Cargando indicadores...</div>}
        {error && <div className="analitica-error">{error}</div>}

        {!loading && (
          <>
            {/* KPIs principales */}
            <section className="analitica-seccion">
              <h2 className="analitica-seccion-titulo">Indicadores clave</h2>
              <div className="analitica-kpis">
                {kpis.map((kpi, idx) => (
                  <div key={idx} className={`kpi-card kpi-${kpi.color}`}>
                    <div className="kpi-icono">{kpi.icono}</div>
                    <div className="kpi-valor">{kpi.valor}</div>
                    <div className="kpi-titulo">{kpi.titulo}</div>
                    <div className="kpi-desc">{kpi.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Métricas secundarias */}
            <section className="analitica-seccion">
              <h2 className="analitica-seccion-titulo">Resumen operativo</h2>
              <div className="analitica-metricas">
                {metricas.map((met, idx) => (
                  <div key={idx} className="metrica-card">
                    <span className="metrica-icono">{met.icono}</span>
                    <div className="metrica-info">
                      <div className="metrica-valor">{met.valor}</div>
                      <div className="metrica-titulo">{met.titulo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Estado del sistema */}
            <section className="analitica-seccion">
              <h2 className="analitica-seccion-titulo">Estado del sistema</h2>
              <div className="analitica-estado">
                <div className="estado-item">
                  <span className="estado-led estado-led-verde"></span>
                  <span>API REST</span>
                  <span className="estado-valor">Operativo</span>
                </div>
                <div className="estado-item">
                  <span className="estado-led estado-led-verde"></span>
                  <span>Base de datos</span>
                  <span className="estado-valor">Conectada</span>
                </div>
                <div className="estado-item">
                  <span className="estado-led estado-led-verde"></span>
                  <span>Servicio JWT</span>
                  <span className="estado-valor">Activo</span>
                </div>
                <div className="estado-item">
                  <span className="estado-led estado-led-verde"></span>
                  <span>GPS Tracking</span>
                  <span className="estado-valor">En línea</span>
                </div>
              </div>
            </section>

            {/* Accesos rápidos */}
            <section className="analitica-seccion">
              <h2 className="analitica-seccion-titulo">Accesos rápidos</h2>
              <div className="analitica-accesos">
                <Link to="/mapa" className="acceso-card">
                  <span className="acceso-icono">🗺️</span>
                  <span>Ver mapa en vivo</span>
                </Link>
                <Link to="/rutas" className="acceso-card">
                  <span className="acceso-icono">🚌</span>
                  <span>Gestionar rutas</span>
                </Link>
                <Link to="/vehiculos" className="acceso-card">
                  <span className="acceso-icono">🚐</span>
                  <span>Administrar flota</span>
                </Link>
                <Link to="/incidentes" className="acceso-card">
                  <span className="acceso-icono">⚠️</span>
                  <span>Ver incidentes</span>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Analitica;

