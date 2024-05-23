import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import uzLocale from '@fullcalendar/core/locales/uz';
import { useCountries } from 'use-react-countries';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Menu, MenuHandler, MenuList, MenuItem, Radio, Typography } from '@material-tailwind/react';
import { ClockIcon, PhoneIcon } from '@heroicons/react/24/solid';
import Select from 'react-select';
import axios from 'axios';
import {PhoneInput} from "react-international-phone";


function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-full w-full scale-105"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Calendar() {
  const [services, setServices] = useState([]);
  const { countries } = useCountries();
  const [country, setCountry] = useState(177);
  const { name, flags, countryCallingCode } = countries[country];
  const [selectedTime, setSelectedTime] = useState('00:00');
  const [eventTitle, setEventTitle] = useState('');
  const [eventNumber, setEventNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([{}]);
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({});
  
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
    fetchEvents();
    fetchServices();
  }, []); 

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/admin/service");
      setServices(response.data.data);
    } catch (error) {
      console.error("Ошибка при получении списка сервисов:", error);
    }
  };
  const fetchEvents = async (calendarId) => {
    try {
      const response = await axiosInstance.get(`/calendar`);
      setEvents(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Ошибка при получении списка событий календаря:", error);
    }
  };

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;
    setSelectedTime('00:00');
    setOpenDialog(true);
    setSelectedDate(selectedDate);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEventTitle('');
    setEventNumber('');
    setSelectedType('');
    setSelectedService('');
    setSelectedEvent(null);
    setErrors({}); 
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleTitleChange = (event) => {
    setEventTitle(event.target.value);
  };

  const handleNumberChange = (phone) => {
    setEventNumber(phone); // Устанавливаем значение телефона
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setEventTitle(event.title);
    setEventNumber(event.extendedProps.phone);

    // Находим объект сервиса по его id
    const selectedService = services.find(service => service.id === event.extendedProps.service?.id);

    // Проверяем, был ли найден объект сервиса
    if (selectedService) {
      setSelectedService({ value: selectedService.id, label: selectedService.name });
    } else {
      setSelectedService(''); // Если объект сервиса не найден, сбрасываем выбранный сервис
    }

    if (event.start) {
      const date = event.start.toISOString().split('T')[0];
      let hours = event.start.getHours();
      let minutes = event.start.getMinutes();

      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;

      setSelectedDate(date);
      setSelectedTime(`${hours}:${minutes}`);
    }
    setSelectedType(event.extendedProps.type || '');

    setOpenDialog(true);
    setSelectedEvent(event);
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axiosInstance.delete(`/calendar/${selectedEvent.id}`);
      if (response.status === 200) {
        fetchEvents(); 
        setOpenDialog(false); 
        setEventTitle('');
        setEventNumber('');
      } else {
        console.error("Ошибка при удалении события:", response);
      }
    } catch (error) {
      console.error("Ошибка при удалении события:", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (validateFields()) {
      return;
    }

    const date = new Date(selectedEvent.start);
    const [hours, minutes] = selectedTime.split(':');
    date.setHours(hours, minutes);
  
    const updatedEventData = {
      title: eventTitle,
      phone: eventNumber,
      start_at: date.toISOString(),
    };
  
    try {
      const response = await axiosInstance.put(`/calendar/${selectedEvent.id}`, updatedEventData);
      if (response.status === 200) {
        fetchEvents(); 
        setOpenDialog(false); 
        setEventTitle('');
        setEventNumber('');
      } else {
        console.error("Ошибка при обновлении события:", response);
      }
    } catch (error) {
      console.error("Ошибка при обновлении события:", error);
    }
  };
  
  
  

  const handleConfirmEvent = async () => {
    if (validateFields()) {
      return;
    }
  
    const eventData = {
      title: eventTitle,
      phone: eventNumber,
      start_at: `${selectedDate}T${selectedTime}`
    };
    console.log(selectedService)
  
    try {
      const response = await axiosInstance.post("/calendar", eventData);
      const newEvent = response.data.data;
      setEvents([...events, newEvent]);
      setOpenDialog(false);
      setEventTitle('');
      setEventNumber('');
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const renderEventContent = (eventInfo) => {
    const { title, phone } = eventInfo.event.extendedProps;
    const startTime = eventInfo.event.start ? eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return (
      <div>
        <p className='flex font-semibold items-center text-xs gap-1'>
          <img src="/watch2.png" className='h-4 w-4' alt="" /> {startTime}
        </p>
        <p className='font-bold text-xs flex items-center gap-1 mt-1 capitalize'> <img src="/patient.png" className='h-4 w-4' alt="" /> {title}</p>
        <p className='font-medium text-xs flex items-center gap-1 mt-1'> <img src="/mobile4.png" className='h-4 w-4' alt="" /> {phone}</p>
      </div>
    );
  };

  const handleEventDrop = async (info) => {
    const { event } = info;
    const updatedEvent = {
      title: event.title,
      phone: event.extendedProps.phone,
      start_at: event.start.toISOString()
    };
  
    try {
      const response = await axiosInstance.put(`/calendar/${event.id}`, updatedEvent);
      if (response.status === 200) {
        fetchEvents(); // Обновите события после успешного обновления
      } else {
        console.error("Ошибка при обновлении события:", response);
      }
    } catch (error) {
      console.error("Ошибка при обновлении события:", error);
    }
  };
  

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };


  const validateFields = () => {
    const newErrors = {};
    let hasError = false;

    if (eventTitle.trim() === '') {
      newErrors.eventTitle = 'Илтимос ФИО-ни киринтинг';
      hasError = true;
    }

    if (eventNumber.trim() === '') {
      newErrors.eventNumber = 'Илтимос телефон ракамни киринтинг';
      hasError = true;
    }

    if (selectedDate === '') {
      newErrors.selectedDate = 'Пожалуйста, выберите дату.';
      hasError = true;
    }

    if (selectedTime === '00:00') {
      newErrors.selectedTime = 'Илтимос санани киринтинг';
      hasError = true;
    }

    setErrors(newErrors);
    return hasError;
  };
  

  return (
    <div className="w-full px-12">
      <FullCalendar
        locale={uzLocale}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        themeSystem="lux"
        editable={true}
        height={'90vh'}
        selectable={true}
        selectMirror={true}
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start_at,
          end: event.end_at,
          extendedProps: {
            phone: event.phone,
            title: event.title,
            start: event.start
          },
        }))}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />
      <Dialog className='w-min' open={openDialog} handler={handleDialogClose}>
        <DialogHeader className="text-lg font-medium leading-6 text-gray-900">Бемор қўшиш</DialogHeader>
        <DialogBody>
          <div className="mb-4">
            <label htmlFor="time" className="block mb-1 text-sm font-medium text-gray-700">
              ФИО:
            </label>
            <Input
                name="name"
                value={eventTitle}
                onChange={handleTitleChange}
                placeholder="ФИО: *"
                className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                labelProps={{
                  className: "hidden",
                }}
                containerProps={{className: "min-w-[100px]"}}
                size="lg"

                error={errors.eventTitle}
            />
            {errors.eventTitle && <p className="text-red-500 text-xs mt-1">{errors.eventTitle}</p>}
            <div className="mt-4">
              <label htmlFor="time" className="block text-sm mb-1 font-medium text-gray-700">
                Телефон раками:
              </label>
              <PhoneInput

                  label="Static"
                  international={false}
                  defaultCountry="uz"
                  prefix=""
                  value={eventNumber || ''}
                  onChange={(phone) => handleNumberChange(phone)} // Передаем значение телефона напрямую
                  inputClass="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {errors.eventNumber && <p className="text-red-500 text-xs mt-1">{errors.eventNumber}</p>}
          </div>
          <TimePicker selectedTime={selectedTime} onTimeChange={handleTimeChange} error={errors.selectedTime}/>
        </DialogBody>
        <DialogFooter className='flex gap-x-4'>
          <Button onClick={selectedEvent ? handleUpdateEvent : handleConfirmEvent}>
            {selectedEvent ? 'Обновить' : 'Сохранить'}
          </Button>
          {selectedEvent && (
            <button onClick={handleDeleteEvent} className='transition-background inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-gray-100 via-[#FFC6C6] to-[#C83333] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-black hover:text-white duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'>
            Удалить
            </button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function TimePicker({ selectedTime, onTimeChange, error }) {
  const handleTimeChange = (event) => {
    onTimeChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
        Келиш вақти:
      </label>
      <Input
        type="time"
        id="time"
        className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
        labelProps={{
          className: "hidden",
        }}
        containerProps={{ className: "min-w-[100px]" }}
        value={selectedTime}
        onChange={handleTimeChange}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}