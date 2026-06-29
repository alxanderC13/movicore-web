import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/authService';
import './Rutas.css';

function Rutas() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    cargarRutas();
  }, [pagina]);

  const cargarRutas = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page: pagina,
      });
      if (busqueda) params.append('search', busqueda);

      const response = await api.get(`/public/routes/?${params.toString()}`);
      const data = response.data;

      setRutas(data.results || data);
      setTotalRegistros(data.count || (data.results || data).length);
      setTotalPaginas(Math.ceil((data.count || 0) / 20) || 1);
    } catch (err) {
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
      } else {
        setError('No se pudieron cargar las rutas. Verifica que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPagina(1);
    cargarRutas();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="rutas-container">
      {/* Header */}
      <header className="rutas-header">
        <div className="rutas-header-left">
          <Link to="/dashboard" className="rutas-logo">MoviCore</Link>
          <span className="rutas-breadcrumb">/ Rutas</span>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* Contenido */}
      <main className="rutas-main">
        <div className="rutas-titulo">
          <div>
            <h1>🚌 Rutas de transporte</h1>
            <p>{totalRegistros} ruta(s) registrada(s) en el sistema</p>
          </div>
          <button className="btn-primary" onClick={() => alert('Funcionalidad próximamente')}>
            + Nueva ruta
          </button>
        </div>

        {/* Búsqueda */}
        <form onSubmit={handleBuscar} className="rutas-busqueda">
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="btn-primary">Buscar</button>
        </form>

        {/* Mensajes de estado */}
        {loading && <div className="rutas-loading">Cargando rutas...</div>}
        {error && <div className="rutas-error">{error}</div>}

        {/* Tabla */}
        {!loading && !error && (
          <>
            <div className="rutas-tabla-wrapper">
              <table className="rutas-tabla">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rutas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="rutas-tabla-vacio">
                        No hay rutas para mostrar
                      </td>
                    </tr>
                  ) : (
                    rutas.map((ruta) => (
                      <tr key={ruta.id}>
                        <td className="rutas-codigo">{ruta.code}</td>
                        <td className="rutas-nombre">{ruta.name}</td>
                        <td className="rutas-descripcion">
                          {ruta.description || <span className="rutas-vacio">—</span>}
                        </td>
                        <td>
                          <Link to={`/mapa`} className="rutas-accion">
                            Ver en mapa
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="rutas-paginacion">
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

export default Rutas;

