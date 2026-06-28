import api from './api';

const authService = {
  // Iniciar sesión: envía usuario y contraseña, recibe tokens
  login: async (username, password) => {
    const response = await api.post('/auth/login/', {
      username,
      password,
    });
    const { access, refresh } = response.data;
    // Guardar tokens en el navegador
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return response.data;
  },

  // Registrar un nuevo usuario
  register: async (username, password) => {
    const response = await api.post('/auth/register/', {
      username,
      password,
    });
    return response.data;
  },

  // Cerrar sesión: borra los tokens
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Obtener datos del usuario autenticado
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  // Verificar si el usuario está logueado
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
