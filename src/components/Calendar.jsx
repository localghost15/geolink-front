import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import uzLocale from '@fullcalendar/core/locales/uz-cy';
import { Dialog, DialogHeader, DialogBody, DialogFooter, IconButton,} from '@material-tailwind/react';
import {ArrowUpOnSquareIcon, ClockIcon, PhoneIcon, TrashIcon} from '@heroicons/react/24/solid';
import axios from 'axios';
import {Button, Modal, notification, TimePicker as TimePickerInput, Input} from "antd";
import moment from 'moment';
import 'moment/locale/uz';
import axiosInstance from "../axios/axiosInstance";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'

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
  const [country, setCountry] = useState(177);
  const [selectedTime, setSelectedTime] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventNumber, setEventNumber] = useState('+998');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([{}]);
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    fetchEvents();
    fetchServices();
  }, []);


  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/admin/service");
      setServices(response.data.data);
    } catch (error) {
      console.error("Ошибка при получении списка сервисов:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/calendar");
      setEvents(response.data.data);
      setFilteredEvents(response.data.data); // Initialize filtered events
    } catch (error) {
      console.error("Ошибка при получении списка событий календаря:", error);
    }
  };

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;
    setSelectedTime(null);
    setOpenDialog(true);
    setSelectedDate(selectedDate);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEventTitle('');
    setEventNumber('+998');
    setSelectedType('');
    setSelectedService('');
    setSelectedEvent(null);
    setSelectedTime('');
    setErrors({});
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time ? time.format('HH:mm') : null);
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
    setSelectedDate(event.extendedProps.start)

    // Устанавливаем `start_time` для TimePickerInput
    setSelectedTime(event.extendedProps.start_time);

    // Находим объект сервиса по его id
    const selectedService = services.find(service => service.id === event.extendedProps.service?.id);

    // Проверяем, был ли найден объект сервиса
    if (selectedService) {
      setSelectedService({ value: selectedService.id, label: selectedService.name });
    } else {
      setSelectedService(''); // Если объект сервиса не найден, сбрасываем выбранный сервис
    }

    setSelectedType(event.extendedProps.type || '');
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleSearchInputChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    filterEvents(searchText);
  };

  const filterEvents = (searchText) => {
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredEvents(filteredEvents);
  };


  const handleDeleteEvent = async () => {
    try {
      const response = await axiosInstance.delete(`/calendar/${selectedEvent.id}`);
      if (response.status === 200) {
        fetchEvents();
        setOpenDialog(false);
        setEventTitle('');
        setSelectedTime('');
        setEventNumber('+998');
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

    const selectedDateTime = `${selectedDate} ${selectedTime}`;

    const updatedEventData = {
      title: eventTitle,
      phone: eventNumber,
      start_at: selectedDateTime, // Use the formatted date and time
    };

    try {
      const response = await axiosInstance.put(`/calendar/${selectedEvent.id}`, updatedEventData);
      if (response.status === 200) {
        fetchEvents();
        setOpenDialog(false);
        setEventTitle('');
        setSelectedTime('');
        setEventNumber('+998');
      } else {
        console.error("Ошибка при обновлении события:", response);
      }
    } catch (error) {
      console.error("Ошибка при обновлении события:", error);
    }
  };




  const handleEventDrop = async (info) => {
    const { event } = info;

    console.log("Event info:", event);

    if (!event.start) {
      console.error("Event start is null or undefined:", event);
      return;
    }

    // Create a new Date object with the dropped event's start time
    const newStartDate = new Date(event.start);

    // Format the date as "YYYY-MM-DD HH:mm:ss"
    const formattedStartDate = `${newStartDate.getFullYear()}-${String(newStartDate.getMonth() + 1).padStart(2, '0')}-${String(newStartDate.getDate()).padStart(2, '0')} ${event.extendedProps.start_time}`;

    // Prepare updated event data
    const updatedEvent = {
      title: event.title,
      phone: event.extendedProps.phone,
      start_at: formattedStartDate // Update start date/time of the dropped event in the desired format
    };

    try {
      const response = await axiosInstance.put(`/calendar/${event.id}`, updatedEvent);
      if (response.status === 200) {
        notification.success({
          message: 'Учрашув янгиланди',
          description: `Учрашув "${event.title}" га янгиланди`,
          duration: 2,
          placement: 'bottomRight'
        });
        fetchEvents();
      } else {
        console.error("Error updating event:", response);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };






  const handleConfirmEvent = async () => {
    if (validateFields()) {
      return;
    }

    const selectedDateTime = `${selectedDate} ${selectedTime}`;

    // Format the date without the "T" separator
    const formattedDateTime = moment(selectedDateTime).format('YYYY-MM-DD HH:mm');

    const eventData = {
      title: eventTitle,
      phone: eventNumber,
      start_at: formattedDateTime,
    };

    try {
      const response = await axiosInstance.post("/calendar", eventData);
      const newEvent = response.data.data;
      setEvents([...events, newEvent]);
      setOpenDialog(false);
      setEventTitle('');
      setEventNumber('+998');
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };



  const renderEventContent = (eventInfo) => {
    const { title, phone, start_time } = eventInfo.event.extendedProps;
    return (
        // <div >
        //   <p className='flex font-semibold items-center text-xs gap-1'>
        //    <div className="bg-white rounded-md p-1"><img src="/watch2.png" className='h-6 w-6' /></div>  {start_time}
        //   </p>
        //   <p className='font-bold text-xs flex items-center gap-1 mt-1 capitalize'>
        //     <div className="bg-white rounded-md p-1"><img src="/patient.png" className='h-6 w-6' alt=""/></div>
        //     {title}</p>
        // </div>

        <div className="flex flex-col justify-center text-xs text-white bg-[#00AA81] rounded-md max-w-[319px]">
          <div className="flex overflow-hidden relative flex-col px-4 py-3 w-full aspect-[2.33]">
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c9086af62bd60c01abe617a3837f029e0a89ab60334f8892969364d7c6e7b2b?apiKey=0e60d26ffe404316aa35b6241738714a&"
                className="object-cover absolute inset-0 size-full"
            />
            <div className="flex relative gap-5 justify-between px-0.5 text-sm font-semibold whitespace-nowrap">
              <div className="my-auto">{start_time}</div>
              <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b378760b1d802bb67646e80faaec3f0b81d42d209110e43f6035386283b8b36d?apiKey=0e60d26ffe404316aa35b6241738714a&"
                  className="shrink-0 w-6 aspect-square"
              />
            </div>
            <div className="relative  font-medium">
              {title}
            </div>
          </div>
        </div>
    );
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
      <div className="w-full ">
        <div className="flex w-full">
          <div className="w-1/5 ">
            <h1 className="text-xl font-semibold mb-3 px-3 pb-1">Барча банд қилинган учрашувлар</h1>
            <div className="px-3">
              <Input
                  value={searchText}
                  onChange={handleSearchInputChange}
                  placeholder="Излаш..."
                  className="w-full border border-gray-300 p-2 mb-4 rounded-md"
              />
            </div>
            <div className="h-[50vh] overflow-y-auto">
              {filteredEvents.map(event => (
                  <div className="fc-event12" key={event.id}>
                    <p className='flex font-semibold items-center text-xs gap-1'>
                      <img src="/watch2.png" className='h-4 w-4' alt=""/>
                      {event.start_at} {event.start_time}
                    </p>
                    <p className='font-bold text-xs flex items-center gap-1 mt-1 capitalize'><img src="/patient.png"
                                                                                                  className='h-4 w-4'
                                                                                                  alt=""/> {event.title}
                    </p>
                    <p className='font-medium text-xs flex items-center gap-1 mt-1'><img src="/mobile4.png"
                                                                                         className='h-4 w-4'
                                                                                         alt=""/> {event.phone}</p>
                  </div>

              ))}
            </div>
          </div>

          <div className="w-full px-5">
            <FullCalendar
                locale={uzLocale}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  start: 'prev,next today',
                  center: '',
                  end: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                // dayMaxEvents={true}
                themeSystem="lux"
                editable={true}
                height={'85vh'}
                selectable={true}
                selectMirror={true}
                events={events.map(event => ({
                  id: event.id,
                  title: event.title,
                  start: event.start_at,
                  start_time: event.start_time,
              end: event.end_at,
              extendedProps: {
                phone: event.phone,
                title: event.title,
                start: event.start_at,
                start_time: event.start_time,
              },
            }))}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
        />
      </div>
    </div>
      <Modal title="Бемор қўшиш" centered footer={[
          <div className="flex gap-3 justify-end">
            <Button type="primary" className='flex gap-x-1 items-center font-medium'
                    onClick={selectedEvent ? handleUpdateEvent : handleConfirmEvent}>
              {selectedEvent ? 'Обновить' : 'Сохранить'}
              <ArrowUpOnSquareIcon className="h-4 w-4"/>
            </Button>
            {selectedEvent && (
                <Button danger shape="round" onClick={handleDeleteEvent} className="rounded-full">
                  <TrashIcon className="h-4 w-4"/>
                </Button>
            )}
          </div>
      ]} className='w-min' open={openDialog} onCancel={handleDialogClose}>
        <div className="mb-4">
          <label htmlFor="time" className="block mb-1 text-sm font-medium text-gray-700">
            ФИО:
          </label>
          <Input
              name="name"
              value={eventTitle}
              onChange={handleTitleChange}
              placeholder="ФИО: *"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{className: "min-w-[100px]"}}
              size="lg"

              error={errors.eventTitle}
          />
          {errors.eventTitle && <p className="text-red-500 text-xs mt-1">{errors.eventTitle}</p>}
          <div className="mt-4 ">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Телефон раками:
            </label>
            <PhoneInput
                dropdownClass="will-change-auto"
                countryCodeEditable={false}
                disableDropdown={true}
                country={'uz'}
                preferredCountries={['uz']}
                onlyCountries={['uz']}
                inputClass="ant-input"
                containerClass="ant-input"
                inputStyle={{ width: '100%' }}
                placeholder="Введите номер телефона"
                value={eventNumber || ''}
                onChange={(phone) => handleNumberChange(phone)}
            />
          </div>
          {errors.eventNumber && <p className="text-red-500 text-xs mt-1">{errors.eventNumber}</p>}
        </div>
        <TimePickerInput
            value={selectedTime ? moment(selectedTime, 'HH:mm') : null}
            needConfirm={false}
            id="time"
            className="w-full"
            onChange={handleTimeChange}
            format={'HH:mm'}
        />

      </Modal>
    </div>
  );
}
