import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const formatTime = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[date.getDay()];
    const formattedDate = `${dayName} ${date.getDate()} ${date.toLocaleString('id-ID', { month: 'long' })} ${date.getFullYear()} | ${date.toLocaleTimeString('id-ID')}`;
    return formattedDate;
  };

  return (
    <span className="text-gray-600">
      {formatTime(currentTime)}
    </span>
  );
};

export default Clock;
