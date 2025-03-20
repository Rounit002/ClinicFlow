import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment } from "../dashboard/AppointmentPreview";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAddAppointment?: () => void;
  className?: string;
}

type DayType = {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
};

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onAddAppointment,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[] | null>(null);

  // Automatically select today's appointments on mount or when appointments update
  useEffect(() => {
    const todayDateStr = new Date().toLocaleDateString("en-CA");
    const todaysAppointments = appointments.filter((apt) => {
      const appointmentDate = new Date(apt.date).toLocaleDateString("en-CA");
      return appointmentDate === todayDateStr;
    });
    setSelectedAppointments(todaysAppointments);
  }, [appointments]);

  const generateCalendarDays = (): DayType[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const today = new Date();
    const days: DayType[] = [];

    // Previous month filler days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const dayAppointments = appointments.filter((apt) => {
        if (!apt.date) return false;
        const aptDate = new Date(apt.date.replace(" ", "T")); // Convert "2025-03-14 11:15:00" to "2025-03-14T11:15:00"
        return aptDate.toLocaleDateString("en-CA") === dateStr;
      });
      days.push({
        date: dayNum,
        isCurrentMonth: false,
        isToday: today.toLocaleDateString("en-CA") === dateStr,
        appointments: dayAppointments,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayAppointments = appointments.filter((apt) => {
        if (!apt.date) return false;
        const aptDate = new Date(apt.date.replace(" ", "T")); // Convert to ISO format
        return aptDate.toLocaleDateString("en-CA") === dateStr;
      });
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: today.toLocaleDateString("en-CA") === dateStr,
        appointments: dayAppointments,
      });
    }

    // Next month filler days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayAppointments = appointments.filter((apt) => {
        if (!apt.date) return false;
        const aptDate = new Date(apt.date.replace(" ", "T")); // Convert to ISO format
        return aptDate.toLocaleDateString("en-CA") === dateStr;
      });
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: today.toLocaleDateString("en-CA") === dateStr,
        appointments: dayAppointments,
      });
    }

    return days;
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = generateCalendarDays();

  const previousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (day: DayType) => {
    console.log("Day clicked:", day);
    setSelectedAppointments(day.appointments);
  };

  return (
    <div className={cn("bg-white rounded-2xl border shadow-lg animate-fade-in overflow-hidden", className)}>
      <div className="p-6 border-b flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={previousMonth} className="p-2 rounded-md hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="font-medium text-lg">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <button onClick={nextMonth} className="p-2 rounded-md hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          onClick={onAddAppointment}
        >
          <Plus className="h-5 w-5" />
          <span>New Appointment</span>
        </button>
      </div>
      <div className="p-4 grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            onClick={() => handleDateClick(day)}
            className={cn(
              "p-2 border rounded-lg text-center cursor-pointer transition-all",
              day.isCurrentMonth ? "bg-white" : "bg-gray-100",
              day.isToday && "border-blue-500 shadow-md",
              day.appointments.length > 0 ? "hover:border-blue-200 hover:shadow-md" : "",
              !day.isCurrentMonth && "opacity-40"
            )}
          >
            <span className="text-sm font-medium">{day.date}</span>
            {day.appointments.length > 0 && (
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 mx-auto"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedAppointments !== null && (
        <div className="p-4 border-t">
          <h3 className="text-lg font-semibold mb-3">Appointments for Selected Date</h3>
          {selectedAppointments.length > 0 ? (
            <ul className="space-y-3">
              {selectedAppointments.map((apt, index) => (
                <li key={index} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                  <p className="font-medium">{apt.patientName}</p>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                    <p><span className="text-gray-500">Phone:</span> {apt.patientPhone}</p>
                    <p><span className="text-gray-500">Time:</span> {apt.time}</p>
                    <p><span className="text-gray-500">Type:</span> {apt.type}</p>
                    <p>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={cn(
                          "ml-1 inline-block px-2 py-0.5 rounded-full text-xs",
                          apt.status === "confirmed" && "bg-green-100 text-green-800",
                          apt.status === "pending" && "bg-yellow-100 text-yellow-800",
                          apt.status === "canceled" && "bg-red-100 text-red-800",
                          apt.status === "completed" && "bg-blue-100 text-blue-800"
                        )}
                      >
                        {apt.status}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 p-3 bg-gray-50 rounded-lg">No appointments for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;