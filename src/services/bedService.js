import axiosInstance from "../axios/axiosInstance";


export const createBed = async (apartmentId, bedData) => {
    try {
        const response = await axiosInstance.post(`admin/apartment/bed/${apartmentId}`, bedData);
        return response.data;
    } catch (error) {
        console.error('Error creating bed:', error);
        throw error;
    }
};

export const updateBed = async (bedId, bedData) => {
    try {
        const response = await axiosInstance.put(`admin/apartment/bed/${bedId}`, bedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating bed with ID ${bedId}:`, error);
        throw error;
    }
};

export const deleteBed = async (bedId) => {
    try {
        const response = await axiosInstance.delete(`admin/apartment/bed/${bedId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting bed with ID ${bedId}:`, error);
        throw error;
    }
};
