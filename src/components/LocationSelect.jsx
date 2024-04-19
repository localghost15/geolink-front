import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const LocationSelect = () => {
  const axiosInstance = axios.create({
    baseURL: 'https://back.geolink.uz/api/v1'
  });

  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await axiosInstance.get('/global/province');
      setProvinces(response.data.data.map(province => ({ value: province.id, label: province.name })));
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchDistricts = async (id) => {
    try {
      const response = await axiosInstance.get(`/global/province/${id}`);
      setDistricts(response.data.data.districts.map(district => ({ value: district.id, label: district.name })));
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    fetchDistricts(selectedOption.value);
  };

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
  };

  return (
    <div className='flex col-span-2 w-full gap-x-4 '>
      <Select 
      className='text-sm'
        id="province" 
        value={selectedProvince} 
        onChange={handleProvinceChange} 
        options={provinces} 
        placeholder="Вилоят" 
      />
      <Select 
      className='text-sm'
        id="district" 
        value={selectedDistrict} 
        onChange={handleDistrictChange} 
        options={districts} 
        placeholder="Шаҳар, туман" 
      />
    </div>
  );
};

export default LocationSelect;
