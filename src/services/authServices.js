import axios from "axios";

// Создание экземпляра axios с базовой конфигурацией
const axiosInstance = axios.create({
    baseURL: 'https://back.geolink.uz/api/v1',
    timeout: 10000, // Установить тайм-аут запроса
    headers: {
        'Content-Type': 'application/json'
    }
});

// Интерсептор для запросов: добавляем токен аутентификации и роль пользователя
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const userRole = localStorage.getItem('userRole');
        if (userRole === 'admin') {
            config.headers['X-Role'] = 'admin';
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Интерсептор для ответов: проверка на истечение срока действия токена и обновление токена
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Если получаем 401 ошибку и это не запрос на обновление токена, пробуем обновить токен
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error("Refresh token not available.");
                }

                const response = await axios.post('https://back.geolink.uz/api/v1/refresh', { token: refreshToken });
                const newToken = response.data.token;

                // Обновляем токен в локальном хранилище и повторяем оригинальный запрос
                localStorage.setItem('token', newToken);
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return axiosInstance(originalRequest);
            } catch (err) {
                // Если обновление токена не удалось, выходим из системы
                logout();
                window.location.href = '/login'; // Перенаправление на страницу логина
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

// Функция для входа пользователя
const login = async (login, password) => {
    try {
        const response = await axiosInstance.post("/login", { login, password });

        if (response.data.success) {
            const userData = response.data.data;
            localStorage.setItem('token', userData.token);
            localStorage.setItem('refreshToken', userData.refreshToken); // Сохраняем рефреш токен
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userRole', userData.role[0]); // Сохраняем роль пользователя
            return { success: true };
        } else {
            console.error("Ошибка входа:", response.data.message);
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error("Ошибка сервера:", error);
        return { success: false, message: "Ошибка сервера" };
    }
};

// Функция для получения роли пользователя
const getUserRole = async () => {
    try {
        const userRole = localStorage.getItem('userRole');
        return userRole;
    } catch (error) {
        console.error("Ошибка при получении роли пользователя:", error);
        return null;
    }
};

// Функция для получения имени пользователя
const getUsername = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            return null;
        }
        return user.name;
    } catch (error) {
        console.error("Ошибка при получении имени пользователя:", error);
        return null;
    }
};

// Функция для выхода из системы
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    // Можно также перенаправить пользователя на страницу логина или домашнюю страницу
    window.location.href = '/login';
};

// Функция для проверки, авторизован ли пользователь
const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

// Экспорт всех функций для использования в приложении
export { login, logout, isLoggedIn, getUserRole, getUsername };
