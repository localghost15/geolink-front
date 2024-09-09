import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import uzLocale from '@fullcalendar/core/locales/uz-cy';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Tooltip as Tool,
  Typography
} from '@material-tailwind/react';
import {ArrowUpOnSquareIcon, ClockIcon, PhoneIcon, TrashIcon} from '@heroicons/react/24/solid';
import axios from 'axios';
import {Button, Modal, notification, TimePicker as TimePickerInput, Input, Tooltip, Divider} from "antd";
import moment from 'moment';
import 'moment/locale/uz';
import allLocales from '@fullcalendar/core/locales-all'
import axiosInstance from "../axios/axiosInstance";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'
import {HiBookmark} from "react-icons/hi2";
import {FaCalendarWeek} from "react-icons/fa6";
import {BsCalendar2WeekFill} from "react-icons/bs";
import {FcCallback} from "react-icons/fc";
import {IoCall} from "react-icons/io5";
import {TbGridDots} from "react-icons/tb";
import {MdPrivacyTip} from "react-icons/md";
import toast, {Toaster} from "react-hot-toast";



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
      toast.success(`Учрашув санаси ўзгартирилди ${response.data.data.start_at}`)
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
    <span
        class="inline-flex capitalize w-full items-center gap-x-2.5 py-1.5 px-3 rounded text-xs font-medium bg-green-100/50 text-green-800">
       <span class="flex relative items-center top-0 end-0 size-3 -me-1.5">
    <span class="animate-ping absolute inline-flex size-full rounded bg-green-400 opacity-75 dark:bg-red-600"></span>
    <span class="relative inline-flex rounded size-3 bg-green-500">
    </span>
  </span>
     <div className="ml-1">
        <span className="text-black font-medium">{title}</span> <br/>
       {start_time}
     </div>
    </span>
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

  const customDayHeaders = ['Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба', 'Якшанба'];

  const formatPhoneNumber = (phone) => {
    return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 10)} ${phone.slice(10)}`;
  };
  return (
      <div className="w-full">
        <div className="flex w-full">
          <div className="w-1/5 border-r px-3">
            <h1 className="text-md font-semibold px-3 pb-3">Барча учрашувлар</h1>
            <div className="">
              <Input
                  prefix={<TbGridDots />}
                  value={searchText}
                  onChange={handleSearchInputChange}
                  placeholder="Излаш..."
                  className="w-full border border-gray-300 p-2 mb-4 rounded-md"
              />
            </div>
            <div className="h-[50vh] overflow-y-auto">
              {filteredEvents.map(event => (
                  <div
                      className="flex mb-2 border-b items-center gap-3 cursor-pointer justify-start p-2  bg-white hover:bg-gray-100/50 rounded-md group"
                      key={event.id}>
                    <div className="bg-gray-300 bg-opacity-40 p-1 h-12 w-12 relative rounded-md">
                      <BsCalendar2WeekFill  className="text-[#00AA81] transition-colors  group-hover:text-[#000]" size="23"/>
                    </div>
                    <div className="text-[#00263E]">
                      <p className="text-sm font-bold capitalize">{event.title}</p>
                      <Tool
                          placement="bottom"
                          className="border border-blue-gray-50 bg-white px-4 py-3 shadow-sm shadow-black/10"
                          content={
                            <div className="w-48">
                              <Typography color="blue-gray" className="font-medium text-sm">
                                Беморга телефон килиш
                              </Typography>
                            </div>
                          }
                      >
                        <a href={`tel:${event.phone}`}
                           className="text-sm flex items-center gap-1 font-medium hover:text-[#008567] text-[#00AA81]">
                          <IoCall/>
                          {formatPhoneNumber(event.phone)}
                        </a>
                      </Tool>
                      <span
                          className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          {event.start_at} &nbsp; {event.start_time}
        </span>
                    </div>
                  </div>
              ))}

            </div>
          </div>

          <div className="w-full px-3">
            <div className="calendar-container">
              <FullCalendar
                  locales={allLocales} locale={'uz'}

                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    start: 'prev,next today',
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  // dayMaxEvents={true}
                  themeSystem="standart"
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


                  navLinks={true}
                  nowIndicator={true}
                  weekNumbers={false}
                  showNonCurrentDates={false}
                  dayHeaders={true}

                  select={handleDateSelect}
                  eventContent={renderEventContent}
                  eventClick={handleEventClick}
                  dayHeaderContent={(args) => customDayHeaders[args.date.getDay()]}
                  eventDrop={handleEventDrop}
              />

              {/* React Tooltip for event hover */}
              <Tooltip id="eventTooltip" />
            </div>
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
