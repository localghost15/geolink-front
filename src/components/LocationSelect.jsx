// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Select from 'react-select';
//
// const LocationSelect = ({ value, onChange, error }) => {
//   const axiosInstance = axios.create({
//     baseURL: 'https://back.geolink.uz/api/v1'
//   });
//
//   const [provinces, setProvinces] = useState([]);
//   const [selectedProvince, setSelectedProvince] = useState(null);
//   const [districts, setDistricts] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//
//   useEffect(() => {
//     fetchProvinces();
//   }, []);
//
//   const fetchProvinces = async () => {
//     try {
//       const response = await axiosInstance.get('/global/province');
//       setProvinces(response.data.data.map(province => ({ value: province.id, label: province.name })));
//     } catch (error) {
//       console.error('Error fetching provinces:', error);
//     }
//   };
//
//   const fetchDistricts = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/global/province/${id}`);
//       setDistricts(response.data.data.districts.map(district => ({ value: district.id, label: district.name })));
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     }
//   };
//
//   const handleProvinceChange = (selectedOption) => {
//     setSelectedProvince(selectedOption);
//     fetchDistricts(selectedOption.value);
//     // Reset selected district when province changes
//     setSelectedDistrict(null);
//     // Pass the selected province value back to the parent component
//     onChange({ province_id: selectedOption.value });
//   };
//
//   const handleDistrictChange = (selectedOption) => {
//     setSelectedDistrict(selectedOption);
//     // Pass the selected district value back to the parent component
//     onChange({ district_id: selectedOption.value });
//   };
//
//   return (
//       <>
//         <div className='flex flex-row  col-span-2 w-full gap-x-4'>
//           <Select
//               className='text-sm  z-20'
//               id="province"
//               value={selectedProvince}
//               onChange={handleProvinceChange}
//               options={provinces}
//               placeholder="Вилоят"
//           />
// <div>
//   <Select
//       className='text-sm'
//       id="district"
//       value={selectedDistrict}
//       onChange={handleDistrictChange}
//       options={districts}
//       placeholder="Шаҳар, туман"
//   />
//   {error && <div className="text-red-500 text-sm ">{error}</div>}
// </div>
//
//         </div>
//
//       </>
//   );
// };
//
// export default LocationSelect;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from 'antd';

const { Option } = Select;

const LocationSelect = ({ value, onChange, error }) => {
  const axiosInstance = axios.create({
    baseURL: 'https://back.geolink.uz/api/v1'
  });

  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    // Устанавливаем выбранные значения при загрузке данных
    if (value?.province_id && provinces.length > 0) {
      const selectedProv = provinces.find(prov => prov.value === value.province_id);
      setSelectedProvince(selectedProv);
    }
    if (value?.district_id && districts.length > 0) {
      const selectedDist = districts.find(dist => dist.value === value.district_id);
      setSelectedDistrict(selectedDist);
    }
  }, [value, provinces, districts]);

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

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    fetchDistricts(value);
    // Reset selected district when province changes
    setSelectedDistrict(null);
    // Pass the selected province value back to the parent component
    onChange({ province_id: value });
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    // Pass the selected district value back to the parent component
    onChange({ district_id: value });
  };

  return (
      <div className='flex flex-row col-span-2 w-full gap-x-4'>
        <Select
            className='text-sm w-full h-10'
            id="province"
            value={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="Вилоят"
        >
          {provinces.map(province => (
              <Option key={province.value} value={province.value}>{province.label}</Option>
          ))}
        </Select>
        <Select
            className='text-sm w-full h-10'
            id="district"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Шаҳар, туман"
            disabled={!selectedProvince} // Деактивируем выбор района, если не выбрана провинция
        >
          {districts.map(district => (
              <Option key={district.value} value={district.value}>{district.label}</Option>
          ))}
        </Select>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
  );
};

export default LocationSelect;
