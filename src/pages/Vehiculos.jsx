import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/authService';
import './Vehiculos.css';

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    cargarVehiculos();
  }, [pagina]);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page: pagina,
      });
      if (busqueda) params.append('search', busqueda);

      const response = await api.get(`/transport/vehicles/?${params.toString()}`);
      const data = response.data;

      setVehiculos(data.results || data);
      setTotalRegistros(data.count || (data.results || data).length);
      setTotalPaginas(Math.ceil((data.count || 0) / 20) || 1);
    } catch (err) {
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
      } else {
        setError('No se pudieron cargar los vehículos. Verifica que el backend esté corriendo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    setPagina(1);
    cargarVehiculos();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Estado del vehículo con color según el código
  const renderEstado = (status) => {
    if (!status) return <span className="vehiculo-estado vehiculo-estado-gris">—</span>;
    const code = (status.code || status.name || '').toLowerCase();

    let clase = 'vehiculo-estado-gris';
    if (code.includes('active') || code.includes('operativ')) clase = 'vehiculo-estado-verde';
    else if (code.includes('maint')) clase = 'vehiculo-estado-amarillo';
    else if (code.includes('out') || code.includes('damag')) clase = 'vehiculo-estado-rojo';

    return <span className={`vehiculo-estado ${clase}`}>{status.name || status.code}</span>;
  };

  return (
    <div className="vehiculos-container">
      {/* Header */}
      <header className="vehiculos-header">
        <div className="vehiculos-header-left">
          <Link to="/dashboard" className="vehiculos-logo">MoviCore</Link>
          <span className="vehiculos-breadcrumb">/ Vehículos</span>
        </div>
        <button className="btn-secondary" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* Contenido */}
      <main className="vehiculos-main">
        <div className="vehiculos-titulo">
          <div>
            <h1>🚐 Flota de vehículos</h1>
            <p>{totalRegistros} vehículo(s) registrado(s) en el sistema</p>
          </div>
          <button className="btn-primary" onClick={() => alert('Funcionalidad próximamente')}>
            + Nuevo vehículo
          </button>
        </div>

        {/* Búsqueda */}
        <form onSubmit={handleBuscar} className="vehiculos-busqueda">
          <input
            type="text"
            placeholder="Buscar por placa, marca o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="btn-primary">Buscar</button>
        </form>

        {/* Mensajes de estado */}
        {loading && <div className="vehiculos-loading">Cargando vehículos...</div>}
        {error && <div className="vehiculos-error">{error}</div>}

        {/* Tabla */}
        {!loading && !error && (
          <>
            <div className="vehiculos-tabla-wrapper">
              <table className="vehiculos-tabla">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Capacidad</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="vehiculos-tabla-vacio">
                        No hay vehículos para mostrar
                      </td>
                    </tr>
                  ) : (
                    vehiculos.map((v) => (
                      <tr key={v.id}>
                        <td className="vehiculos-placa">{v.plate}</td>
                        <td>{v.brand}</td>
                        <td>{v.model}</td>
                        <td>{v.year}</td>
                        <td>
                          <span className="vehiculos-capacidad">
                            👥 {v.capacity}
                          </span>
                        </td>
                        <td>{renderEstado(v.vehicle_status_detail || v.vehicle_status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="vehiculos-paginacion">
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

export default Vehiculos;
