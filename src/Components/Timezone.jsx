import React, { useState } from 'react';
import WeeklyWorkingDays from './Weekdays';

const Timezone = ({ prevData }) => {
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC+0');

  const handleChange = async(e) => {
    setSelectedTimeZone(e.target.value);
  };

  return (
    <>
      <div className='w-full h-20 border-2 border-red-500'>
        <p>TimeZone</p>
        {/* dropdown */}
        <select className='w-full h-10' value={selectedTimeZone} onChange={handleChange}>
          <option value="UTC+0">UTC+0</option>
          <option value="UTC+5.5">UTC+5:30</option>
        </select>
      </div>
      <WeeklyWorkingDays prevdata={prevData} timeZone={selectedTimeZone} />
    </>
  );
};

export default Timezone;
