import axiosInstance from '../axios/axiosInstance';

export const getDispensaryData = async () => {
    try {
        const response = await axiosInstance.get('/dispensary');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных о диспансере:', error);
        throw error;
    }
};

export const getDispensaryDataPatient = async (patientId) => {
    try {
        const response = await axiosInstance.get(`/dispensary?patient=${patientId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных о диспансере:', error);
        throw error;
    }
};

export const postDispensaryData = async (date) => {
    try {
        const response = await axiosInstance.post(`/dispensary`, date);
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке данных о диспансере:', error);
        throw error;
    }
};