import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/uz-cy';
import { fetchEvents, updateEvent } from "../services/globalSerice"; // Assuming you have defined these functions

const DashboardCalendar = () => {
    const locale = esLocale;
    const [events, setEvents] = useState([]);

    const loadEvents = async () => {
        try {
            const eventsData = await fetchEvents();
            setEvents(eventsData);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []); // Run once on component mount

    const handleEventDrop = async ({ event }) => {
        try {
            const eventId = event.id;
            const newStartDate = event.start.toISOString().split('T')[0]; // Используйте toISOString для UTC даты
            const existingStartTime = event.extendedProps.start_time;

            const updatedEventData = {
                ...event.extendedProps,
                id: eventId,
                title: event.title,
                start_at: newStartDate,
                start_time: existingStartTime,
            };

            await updateEvent(eventId, updatedEventData);
            loadEvents(); // Перезагрузите события после обновления
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    };



    const renderEventContent = (eventInfo) => {
        return (
            <div>
                <b>{eventInfo.event.start.toLocaleString()}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        );
    };


    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={locale}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            editable={true}
            eventDrop={handleEventDrop}
            events={events}
            eventContent={renderEventContent} // Custom rendering of event content
        />
    );
};

export default DashboardCalendar;
