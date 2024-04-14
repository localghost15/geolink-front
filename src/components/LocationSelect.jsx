import { useState, useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";
import { GetState, GetCity } from "react-country-state-city";

export default function LocationSelect() {
  const countryid = 236; 
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    GetState(countryid).then((result) => {
      setStateList(result);
      if (result.length > 0) {
        setStateName(result[0].name);
        GetCity(countryid, result[0].id).then((result) => {
          setCityList(result);
        });
      }
    });
  }, []);

  return (
    <div className="flex gap-x-4 col-span-2">
      <select
        className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border   placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-3 rounded-md border-blue-gray-200 "
        onChange={(e) => {
          const state = stateList.find(item => item.name === e.target.value);
          setStateName(state.name);
          GetCity(countryid, state.id).then((result) => {
            setCityList(result);
          });
        }}
        value={stateName}
      >
        {stateList.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border   placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-3 rounded-md border-blue-gray-200 "
        onChange={(e) => {
          const city = cityList.find(item => item.name === e.target.value);
          setCityName(city.name);
        }}
        value={cityName}
      >
        {cityList.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
