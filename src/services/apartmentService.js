import axiosInstance from "../axios/axiosInstance";


export const getApartments = async () => {
    try {
        const response = await axiosInstance.get('admin/apartment');
        return response.data;
    } catch (error) {
        console.error('Error fetching apartments:', error);
        throw error;
    }
};


export const getApartmentById = async (id) => {
    try {
        const response = await axiosInstance.get(`admin/apartment/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching apartment with ID ${id}:`, error);
        throw error;
    }
};


export const createApartment = async (apartmentData) => {
    try {
        const response = await axiosInstance.post('admin/apartment', apartmentData);
        return response.data;
    } catch (error) {
        console.error('Error creating apartment:', error);
        throw error;
    }
};


export const updateApartment = async (id, apartmentData) => {
    try {
        const response = await axiosInstance.put(`admin/apartment/${id}`, apartmentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating apartment with ID ${id}:`, error);
        throw error;
    }
};


export const deleteApartment = async (id) => {
    try {
        const response = await axiosInstance.delete(`admin/apartment/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting apartment with ID ${id}:`, error);
        throw error;
    }
};