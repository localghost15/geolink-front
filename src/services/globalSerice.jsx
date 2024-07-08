import axiosInstance from "../axios/axiosInstance";
import moment from "moment";

export const fetchEvents = async () => {
    try {
        const response = await axiosInstance.get('/calendar', {
            signal: new AbortController().signal
        });
        return response.data.data.map(event => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start_at), // Преобразование строки даты в объект Date
            end: new Date(event.end_at), // Преобразование строки даты в объект Date
            startTime: event.start_time, // Время начала события
            endTime: event.end_time, // Время окончания события
            phone: event.user.phone,
        }));
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
    }
};




export const updateEvent = async (eventId, eventData) => {
    const payload = { signal: new AbortController().signal };
    return axiosInstance.put(`/calendar/${eventId}`, eventData, payload);
};