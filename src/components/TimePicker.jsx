import React, { useState } from 'react';

export default function TimePicker({ selectedTime, onTimeChange, error }) {

  const handleTimeChange = (event) => {
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
        className={`mt-1 p-2.5 block w-full border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        min="09:00"
        max="18:00"
        value={selectedTime}
        onChange={handleTimeChange}
        required
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}