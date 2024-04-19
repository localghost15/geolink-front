import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://back.geolink.uz/api/v1'
});

const login = async (login, password) => {
  try {
    const response = await axiosInstance.post("/login", {
      login,
      password
    });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
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
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        return null;
      }
  
      return user.role;
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
};

const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export { login, logout, isLoggedIn, getUserRole, getUsername };