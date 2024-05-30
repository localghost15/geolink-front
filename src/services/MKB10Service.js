import axiosInstance from "../axios/axiosInstance";

export const fetchMkb10Data = async () => {
    try {
        const response = await axiosInstance.get('/mkb10');
        return response.data.data.map(item => ({
            value: item.code,
            label: `${item.code} - ${item.name}`,
            ...item
        }));
    } catch (error) {
        console.error("Error fetching MKB-10 data:", error);
        return [];
    }
};

export const searchMkb10Data = async (searchQuery) => {
    if (searchQuery !== '') {
        const response = await axiosInstance.get(`/mkb10?search=${searchQuery}`);
        return response.data.data.map(item => ({
            value: item.code,
            label: `${item.code} - ${item.name}`,
            ...item,
        }));
    } else {
        return fetchMkb10Data();
    }
};

export const saveMKB10Data = async (patientId, mkb10Ids) => {
    try {
        if (mkb10Ids.length === 0) {
            throw new Error('MKB10 data is empty');
        }

        // Используем переданный patientId и mkb10Ids
        const response = await axiosInstance.post(`/patient/mkb10/${patientId}`, {
            mkb10: mkb10Ids
        });

        return response.data; // Предполагается, что ответ содержит соответствующие данные
    } catch (error) {
        console.error("Error saving MKB-10 data:", error);
        throw new Error('Failed to save MKB-10 data');
    }
};


