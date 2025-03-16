import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';

function AppointmentCalendar({ appointments, onDateSelect }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // Get calendar days including days from previous/next months to fill the grid
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Get appointments for each day
    const getAppointmentsForDay = (date) => {
        return appointments.filter(appointment => 
            isSameDay(new Date(appointment.appointmentDate), date)
        );
    };

    const handleDateClick = (date, appointments) => {
        setSelectedDate(date);
        onDateSelect(date, appointments);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button 
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => {
                            setCurrentMonth(new Date());
                            setSelectedDate(new Date());
                        }}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        Today
                    </button>
                    <button 
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Week days header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((date) => {
                    const dayAppointments = getAppointmentsForDay(date);
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const isTodays = isToday(date);
                    const isSelected = isSameDay(date, selectedDate);

                    return (
                        <button
                            key={date.toString()}
                            onClick={() => handleDateClick(date, dayAppointments)}
                            className={`
                                aspect-square p-2 rounded-lg flex flex-col items-center justify-center
                                transition-all duration-200 relative
                                ${!isCurrentMonth && 'text-gray-400 hover:bg-gray-50/50'}
                                ${isCurrentMonth && !isSelected && !isTodays && 'hover:bg-gray-50'}
                                ${isTodays && !isSelected && 'bg-blue-50 text-blue-600'}
                                ${isSelected && 'bg-blue-500 text-white shadow-md'}
                            `}
                        >
                            <span className={`text-sm font-medium ${
                                dayAppointments.length > 0 && !isSelected 
                                    ? 'text-blue-600' 
                                    : ''
                            }`}>
                                {format(date, 'd')}
                            </span>
                            
                            {/* Appointment Indicators */}
                            {dayAppointments.length > 0 && (
                                <div className={`
                                    mt-1 text-xs font-medium
                                    ${isSelected ? 'text-white' : 'text-blue-500'}
                                `}>
                                    {dayAppointments.length} appt{dayAppointments.length > 1 ? 's' : ''}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default AppointmentCalendar; 