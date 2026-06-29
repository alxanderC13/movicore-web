import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/authService';
import './Incidentes.css';

function Incidentes() {
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroSeveridad, setFiltroSeveridad] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    cargarIncidentes();
  }, [pagina, filtroSeveridad, filtroEstado]);

  const cargarIncidentes = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ page: pagina });
      if (filtroSeveridad) params.append('severity', filtroSeveridad);
      if (filtroEstado) params.append('status', filtroEstado);

      const response = await api.get(`/incidents/incidents/?${params.toString()}`);
      const data = response.data;

      setIncidentes(data.results || data);
      setTotalRegistros(data.count || (data.results || data).length);
      setTotalPaginas(Math.ceil((data.count || 0) / 20) || 1);
    } catch (err) {
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
      } else {
        setError('No se pudieron cargar los incidentes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Badge de severidad
  const renderSeveridad = (severity) => {
    if (!severity) return <span className="badge-gris">—</span>;
    const sev = severity.toLowerCase();
    const labels = { low: 'BAJA', medium: 'MEDIA', high: 'ALTA' };
    const clase = sev === 'high' ? 'badge-rojo' : sev === 'medium' ? 'badge-amarillo' : 'badge-amarillo-claro';
    return <span className={`badge ${clase}`}>{labels[sev] || severity.toUpperCase()}</span>;
  };

  // Badge de estado
  const renderEstado = (status) => {
    if (!status) return <span className="badge-gris">—</span>;
    const s = status.toLowerCase();
    const labels = { open: 'ABIERTO', in_progress: 'EN PROCESO', resolved: 'RESUELTO', closed: 'CERRADO' };
    let clase = 'badge-gris';
    if (s === 'resolved' || s === 'closed') clase = 'badge-verde';
    else if (s === 'in_progress') clase = 'badge-azul';
    else if (s === 'open') clase = 'badge-rojo';
    return <span className={`badge ${clase}`}>{labels[s] || status.toUpperCase()}</span>;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-EC', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="incidentes-container">
      <header className="incidentes-header">
        <div className="incidentes-header-left">
          <Link to="/dashboard" className="incidentes-logo">MoviCore</Link>
          <span className="incidentes-breadcrumb">/ Incidentes</span>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="incidentes-main">
        <div className="incidentes-titulo">
          <div>
            <h1>⚠️ Reporte de incidentes</h1>
            <p>{totalRegistros} incidente(s) registrado(s)</p>
          </div>
          <button className="btn-primary" onClick={() => alert('Funcionalidad próximamente')}>
            + Reportar incidente
          </button>
        </div>

        {/* Filtros */}
        <div className="incidentes-filtros">
          <select
            value={filtroSeveridad}
            onChange={(e) => { setFiltroSeveridad(e.target.value); setPagina(1); }}
          >
            <option value="">Todas las severidades</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }}
          >
            <option value="">Todos los estados</option>
            <option value="open">Abierto</option>
            <option value="in_progress">En proceso</option>
            <option value="resolved">Resuelto</option>
            <option value="closed">Cerrado</option>
          </select>
        </div>

        {loading && <div className="incidentes-loading">Cargando incidentes...</div>}
        {error && <div className="incidentes-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="incidentes-tabla-wrapper">
              <table className="incidentes-tabla">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Severidad</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="incidentes-tabla-vacio">
                        No hay incidentes para mostrar
                      </td>
                    </tr>
                  ) : (
                    incidentes.map((inc) => (
                      <tr key={inc.id}>
                        <td className="incidentes-tipo">
                          {inc.incident_type_detail?.name || inc.incident_type?.name || '—'}
                        </td>
                        <td className="incidentes-descripcion">
                          {inc.description || '—'}
                        </td>
                        <td>{renderSeveridad(inc.severity)}</td>
                        <td>{renderEstado(inc.status)}</td>
                        <td className="incidentes-fecha">
                          {formatearFecha(inc.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className="incidentes-paginacion">
                <button
                  className="btn-secondary"
                  disabled={pagina === 1}
                  onClick={() => setPagina(pagina - 1)}
                >
                  ← Anterior
                </button>
                <span>Página {pagina} de {totalPaginas}</span>
                <button
                  className="btn-secondary"
                  disabled={pagina === totalPaginas}
                  onClick={() => setPagina(pagina + 1)}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Incidentes;
