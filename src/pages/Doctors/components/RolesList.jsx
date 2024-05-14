import React, { Fragment, useState, useEffect } from 'react';
import Select from 'react-select';
import { IconButton, Typography } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from 'axios';

export default function RolesList() {
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
      setRoles(response.data.data.map(role => ({ label: role.name, value: role.id })));
    } catch (error) {
      console.error("Ошибка при получении списка ролей:", error);
    }
  };

  return (
    <>
      <Select
        options={roles}
        isMulti
      />
    </>
  );
}
