import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

export default function RolesList({ value, onChange }) {
    const [roles, setRoles] = useState([]);

    const axiosInstance = axios.create({
        baseURL: 'https://back.geolink.uz/api/v1'
    });

    axiosInstance.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axiosInstance.get("/admin/roles");
            const rolesData = response.data.data.map(role => ({ label: role.name, value: role.id }));
            setRoles(rolesData);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleChange = selectedOption => {
        // Преобразуйте выбранный объект в массив
        onChange(Array.isArray(selectedOption) ? selectedOption : [selectedOption]);
    };

    return (
        <Select
            placeholder='Ролни танланг'
            options={roles}
            value={value}
            onChange={handleChange}
        />
    );
}
