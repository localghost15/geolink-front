import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import uzLocale from '@fullcalendar/core/locales/uz';
import { useCountries } from 'use-react-countries';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { ClockIcon, PhoneIcon } from '@heroicons/react/24/solid';

export default function Calendar() {
  const { countries } = useCountries();
  const [country, setCountry] = useState(177);
  const { name, flags, countryCallingCode } = countries[country];
  const [selectedTime, setSelectedTime] = useState('00:00');
  const [eventTitle, setEventTitle] = useState('');
  const [eventNumber, setEventNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([
    {

    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);

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
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleTitleChange = (event) => {
    setEventTitle(event.target.value);
  };

  const handleNumberChange = (event) => {
    setEventNumber(event.target.value);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setEventTitle(event.title);
    setEventNumber(event.extendedProps.number);
    setSelectedTime(event.startStr.slice(-8, -3));
    setSelectedDate(event.startStr.slice(0, 10));
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleUpdateEvent = () => {
    const updatedEvent = {
      ...selectedEvent,
      title: eventTitle,
      number: eventNumber,
      start: `${selectedDate}T${selectedTime}`,
    };
    const updatedEvents = events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev));
    setEvents(updatedEvents);
    setOpenDialog(false);
  };

  const handleConfirmEvent = () => {
    const newEvent = {
      id: events.length,
      title: eventTitle,
      number: eventNumber,
      start: `${selectedDate}T${selectedTime}`,
      allDay: false,
    };
    setEvents([...events, newEvent]);
    setOpenDialog(false);
    setEventTitle('');
    setEventNumber('');
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div>
        <p className='flex font-medium items-center text-xs gap-1'><ClockIcon className='h-3 w-3' />{eventInfo.timeText}</p>
        <p className='font-medium text-xs flex items-center gap-1 mt-1'><PhoneIcon className='h-3 w-3' /> {`${countryCallingCode} ${eventInfo.event.extendedProps.number}`}</p>
      </div>
    );
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
        events={events}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />
      <Dialog className='w-min' open={openDialog} handler={handleDialogClose}>
        <DialogHeader className="text-lg font-medium leading-6 text-gray-900">Бемор қўшиш</DialogHeader>
        <DialogBody>
          <div className="mb-4">
            <Input name="name" value={eventTitle} onChange={handleTitleChange} label="ФИО: *" size="lg" />
            <div className="flex mt-4">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-11 items-center gap-2 rounded-md rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                  >
                    <img src={flags.svg} alt={name} className="h-4 w-4 rounded-full object-cover" />
                    {countryCallingCode}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] z-[9999] max-w-[18rem]">
                  {countries.map(({ name, flags, countryCallingCode }, index) => {
                    return (
                      <MenuItem
                        key={name}
                        value={name}
                        className="flex items-center gap-2"
                        onClick={() => setCountry(index)}
                      >
                        <img src={flags.svg} alt={name} className="h-5 w-5 rounded object-cover" />
                        {name} <span className="ml-auto">{countryCallingCode}</span>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              <Input
                size="lg"
                value={eventNumber}
                onChange={handleNumberChange}
                type="tel"
                placeholder="Телефон номер:"
                className="rounded-md rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: "before:content-none after:content-none" }}
                containerProps={{ className: "min-w-0" }}
              />
            </div>
          </div>
          <TimePicker onTimeChange={handleTimeChange} />
        </DialogBody>
        <DialogFooter className='flex gap-x-4'>
          <Button onClick={selectedEvent ? handleUpdateEvent : handleConfirmEvent} variant="filled">{selectedEvent ? 'Таҳрирлаш' : 'Сақлаш'}</Button>
          <Button onClick={handleDialogClose} variant="filled" color="red">Орқага</Button>

        </DialogFooter>
      </Dialog>
    </div>
  );
}

function TimePicker({ onTimeChange }) {
  const [selectedTime, setSelectedTime] = useState('--:--');

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    onTimeChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="time" className="block text-sm font-medium text-gray-700">
        Келиш вақти:
      </label>
      <input
        type="time"
        id="time"
        className="mt-1 p-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        min="09:00"
        max="18:00"
        value={selectedTime}
        onChange={handleTimeChange}
        required
      />
    </div>
  );
}
