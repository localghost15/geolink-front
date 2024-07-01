import axiosInstance from "../../axios/axiosInstance";

export const getPatientReport = async (start_at, end_at) => {
    try {
        console.log('Отправляем запрос с датами:', start_at, end_at);
        const response = await axiosInstance.get('/reports/patients', {
            params: {
                start_at,
                end_at
            }
        });
        console.log('Ответ от сервера:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных о пациентах:', error);
        throw error;
    }
};

export const getDoctorsReport = async (start_at, end_at) => {
    try {
        console.log('Отправляем запрос с датами:', start_at, end_at);
        const response = await axiosInstance.get('/reports/doctor', {
            params: {
                start_at,
                end_at
            }
        });
        console.log('Ответ от сервера:', response.data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных о пациентах:', error);
        throw error;
    }
};

export const getDoctorsReportById = async (doctorId, start_at, end_at) => {
    try {
        const response = await axiosInstance.get(`/reports/doctor/${doctorId}`, {
            params: {
                start_at,
                end_at
            }});
        return response.data.data;
    } catch (error) {
        console.error('Ошибка при получении данных о пациентах:', error);
        throw error;
    }
};
