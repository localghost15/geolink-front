import axiosInstance from "../axios/axiosInstance";


// Получение списка stationary
export const getStationary = async () => {
    try {
        const response = await axiosInstance.get('/stationary');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении stationary:', error);
        throw error;
    }
};

// Получение stationary по ID
export const getStationaryById = async (id) => {
    try {
        const response = await axiosInstance.get(`/stationary/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении stationary с ID ${id}:`, error);
        throw error;
    }
};

// Создание нового stationary
export const createStationary = async (data) => {
    try {
        const response = await axiosInstance.post('/stationary', data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании stationary:', error);
        throw error;
    }
};

// Обновление существующего stationary
export const updateStationary = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/stationary/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при обновлении stationary с ID ${id}:`, error);
        throw error;
    }
};

// Удаление stationary по ID
export const deleteStationary = async (id) => {
    try {
        await axiosInstance.delete(`/stationary/${id}`);
    } catch (error) {
        console.error(`Ошибка при удалении stationary с ID ${id}:`, error);
        throw error;
    }
};