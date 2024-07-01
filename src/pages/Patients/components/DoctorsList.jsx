import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

export default function DoctorsSelect({ value, onChange }) {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    // Устанавливаем значение выбранного партнера при инициализации
    if (value && partners.length > 0) {
      const selected = partners.find(partner => partner.id === value);
      setSelectedPartner(selected ? selected.id : null);
    }
  }, [value, partners]);

  const handlePartnerChange = (selectedValue) => {
    setSelectedPartner(selectedValue);
    onChange(selectedValue);
  };

  return (
      <Select
          id='doctors'
          className='text-sm '
          value={selectedPartner}
          onChange={handlePartnerChange}
          placeholder="Ким юборди"
          allowClear
      >
        {partners.map(partner => (
            <Option key={partner.id} value={partner.id}>{partner.name}</Option>
        ))}
      </Select>
  );
}
