import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function CustomFullCalendar({ changeDate }) {
    // Handle date click untuk mengirimkan tanggal ke Dashboard
    const handleDateClick = (info) => {
        console.log('Date clicked:', info.dateStr);
        changeDate(info.dateStr); // Mengirim tanggal yang diklik dalam format YYYY-MM-DD
    };

    // Handle event click untuk mengetahui event yang diklik
    const handleEventClick = (info) => {
        console.log('Event clicked:', info.event);
        // Anda dapat menambahkan logika lain di sini, misalnya membuka modal untuk melihat detail event
    };

    // Handle select untuk menangani pilihan rentang tanggal
    const handleSelect = (info) => {
        console.log('Date range selected:', info.startStr, 'to', info.endStr);
        // Anda dapat menambahkan logika untuk melakukan sesuatu saat rentang tanggal dipilih
    };

    return (
        <div className="container mx-auto mt-10 px-4">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                select={handleSelect}
                selectable={true} // Mengaktifkan fitur pemilihan rentang tanggal
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
