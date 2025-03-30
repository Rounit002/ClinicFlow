import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  type: string;
}

interface AppointmentPreviewProps {
  appointments: Appointment[];
  className?: string;
}

const AppointmentPreview: React.FC<AppointmentPreviewProps> = ({
  appointments,
  className
}) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-elevation-1 animate-scale-in",
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800">Today's Appointments</h3>
        <Link
          to="/appointments"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium relative overflow-hidden ripple"
        >
          View all
        </Link>
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No appointments today</h3>
          <p className="text-sm text-gray-600">
            There are no appointments scheduled for today.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 rounded-xl border border-gray-200 transition-all hover:border-blue-200 hover:shadow-elevation-1 bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{appointment.patientName}</h4>
                    <p className="text-xs text-gray-600">{appointment.type}</p>
                  </div>
                </div>
                <span
                  className={cn("text-xs font-medium px-2 py-1 rounded-full", {
                    "bg-yellow-50 text-yellow-700": appointment.status === "pending",
                    "bg-green-50 text-green-700": appointment.status === "confirmed",
                    "bg-red-50 text-red-700": appointment.status === "canceled",
                    "bg-blue-50 text-blue-700": appointment.status === "completed",
                  })}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {appointment.date}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  {appointment.time}
                </div>
                <div className="flex items-center text-sm text-gray-600 col-span-2">
                  <Phone className="h-4 w-4 mr-2 text-blue-500" />
                  {appointment.patientPhone}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentPreview;