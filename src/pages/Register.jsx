import { Link } from 'react-router-dom';

function Register() {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      maxWidth: '500px',
      margin: '100px auto'
    }}>
      <h1>Registro</h1>
      <p style={{ marginTop: '16px', marginBottom: '24px' }}>
        Esta pantalla la construiremos después del login.
      </p>
      <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '12px 24px', color: 'white' }}>
        Volver al Login
      </Link>
    </div>
  );
}

export default Register;


