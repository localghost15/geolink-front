import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const LocationSelect = ({ value, onChange, error }) => {
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
    // Reset selected district when province changes
    setSelectedDistrict(null);
    // Pass the selected province value back to the parent component
    onChange({ province_id: selectedOption.value });
  };

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    // Pass the selected district value back to the parent component
    onChange({ district_id: selectedOption.value });
  };

  return (
      <>
        <div className='flex flex-row col-span-2 w-full gap-x-4'>
          <Select
              className='text-sm mb-2'
              id="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              options={provinces}
              placeholder="Вилоят"
          />
<div>
  <Select
      className='text-sm'
      id="district"
      value={selectedDistrict}
      onChange={handleDistrictChange}
      options={districts}
      placeholder="Шаҳар, туман"
  />
  {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
</div>

        </div>

      </>
  );
};

export default LocationSelect;
