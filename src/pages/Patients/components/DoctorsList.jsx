import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

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
      setSelectedPartner(selected ? { value: selected.id, label: selected.name } : null);
    }
  }, [value, partners]);

  const handlePartnerChange = (selectedOption) => {
    setSelectedPartner(selectedOption);
    onChange(selectedOption.value);
  };

  const options = partners.map(partner => ({
    value: partner.id,
    label: partner.name,
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
