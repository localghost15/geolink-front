import axiosInstance from "../axios/axiosInstance";

export const fetchTemplates = async () => {
    try {
        const response = await axiosInstance.get('/template');
        const apiData = response.data.data;
        return Promise.all(apiData.map(async item => {
            const textResponse = await axiosInstance.get(`/template/${item.id}`);
            return {
                name: item.title,
                html: textResponse.data.data.text,
            };
        }));
    } catch (error) {
        console.error("Error fetching templates:", error);
        throw error;
    }
};

export const saveTemplate = async (title, text) => {
    try {
        const response = await axiosInstance.post('/template', { title, text });
        const savedTemplate = response.data; // Предполагается, что API возвращает сохраненный шаблон
        return savedTemplate;
    } catch (error) {
        console.error("Error saving template:", error);
        throw error;
    }
};
