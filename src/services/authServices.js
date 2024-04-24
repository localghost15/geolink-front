import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://back.geolink.uz/api/v1'
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Интерцептор запросов для добавления заголовка с ролью "admin"
axiosInstance.interceptors.request.use(
  config => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      config.headers['X-Role'] = 'admin';
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

const login = async (login, password) => {
  try {
    const response = await axiosInstance.post("/login", {
      login,
      password
    });
    if (response.data.success) {
      const userData = response.data.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role[0]); // Сохраняем роль пользователя
      return { success: true };
    } else {
      console.error("Ошибка(");
      return { success: false, message: "Ошибка входа" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Ошибка сервера" };
  }
};

const getUserRole = async () => {
  try {
    const userRole = localStorage.getItem('userRole');
    return userRole;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
const getUsername = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        return null;
      }
  
      return user.name;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole'); // Удаляем сохраненную роль пользователя при выходе
  };

const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export { login, logout, isLoggedIn, getUserRole, getUsername };