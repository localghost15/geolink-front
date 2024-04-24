import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios'; // Импортируем axios для выполнения HTTP-запросов

export default function DoctorsSelect() {
  const [partners, setPartners] = useState([]); // Состояние для хранения данных о партнерах

  useEffect(() => {
    // Функция для загрузки данных о партнерах с сервера
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://back.geolink.uz/api/v1/partners', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPartners(response.data.data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners(); 
  }, []);

  const options = partners.map(partner => ({
    value: partner.id, // Замените на актуальные ключи из данных о партнерах
    label: partner.name, // Замените на актуальные ключи из данных о партнерах
  }));

  return (
    <Select
      id='doctors'
      className='text-sm'
      options={options}
      placeholder="Ким юборди"
    />
  );
}
