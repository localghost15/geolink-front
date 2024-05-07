import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios'; // Импортируем axios для выполнения HTTP-запросов

export default function DoctorsSelect({ onChange }) {
  const [partners, setPartners] = useState([]); // Состояние для хранения данных о партнерах
  const [selectedPartner, setSelectedPartner] = useState(null);
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

  const handlePartnerChange = (selectedOption) => {
    setSelectedPartner(selectedOption);
    console.log("Selected partner id:", selectedOption.value); // Log the selected partner id
    onChange(selectedOption.value); // Pass the selected partner's value to the onChange function
  };

  const options = partners.map(partner => ({
    value: partner.id, // Замените на актуальные ключи из данных о партнерах
    label: partner.name, // Замените на актуальные ключи из данных о партнерах
  }));

  return (
    <Select
      id='doctors'
      className='text-sm'
      options={options}
      value={selectedPartner}
      onChange={handlePartnerChange}
      placeholder="Ким юборди"
    />
  );
}
