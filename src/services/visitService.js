import axiosInstance from "../axios/axiosInstance";

// Функция для отправки запроса на начало визита
export const startVisit = async (visitId) => {
    const payload = { signal: new AbortController().signal };
    return axiosInstance.put(`/visit/start/${visitId}`, payload);
};

// Функция для отправки запроса на завершение визита
export const endVisit = async (visitId) => {
    const payload = { signal: new AbortController().signal };
    return axiosInstance.put(`/visit/end/${visitId}`, payload);
};

// Функция для получения списка визитов пациента
export const fetchVisits = async (patientId, page) => {
    const payload = { signal: new AbortController().signal };
    return axiosInstance.get(`/visit?patient_id=${patientId}&page=${page}`, payload);
};
// Функция для отправки данных о дате визита
export const sendDateToServer = async (visitId, date) => {
    return axiosInstance.post(`/visit/revisit/${visitId}`, date);
};

export const uploadFiles = async (visitId, files) => {
    try {
        const response = await axiosInstance.post(`/visit/upload/${visitId}`, files, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadRemark = async (visitId, editorContent) => {
    try {
        const response = await axiosInstance.post(`/visit/remark/${visitId}`, editorContent, {
            headers: {
                'Content-Type': 'form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


