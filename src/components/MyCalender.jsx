import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function CustomFullCalendar({ changeDate }) {
    // Handle date click untuk mengirimkan tanggal ke Dashboard
    const handleDateClick = (info) => {
        changeDate(info.dateStr); // Mengirim tanggal yang diklik dalam format YYYY-MM-DD
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay',
                }}
                height="auto"
            />
        </div>
    );
}

export default CustomFullCalendar;
