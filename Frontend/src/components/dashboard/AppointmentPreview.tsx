import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        "bg-card rounded-2xl p-6 border border-border shadow-elevation-1 animate-scale-in",
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-foreground">Today's Appointments</h3>
        <Link to="/appointments" className="text-sm text-clinic-600 hover:text-clinic-700 font-medium">
          View all
        </Link>
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-1">No appointments today</h3>
          <p className="text-sm text-muted-foreground">
            There are no appointments scheduled for today.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 rounded-xl border border-border transition-all hover:border-clinic-200 hover:shadow-elevation-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-clinic-50 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-clinic-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{appointment.patientName}</h4>
                    <p className="text-xs text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
                <span
                  className={cn("status-badge", {
                    "status-badge-pending": appointment.status === "pending",
                    "status-badge-confirmed": appointment.status === "confirmed",
                    "status-badge-canceled": appointment.status === "canceled",
                    "status-badge-completed": appointment.status === "completed",
                  })}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {appointment.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {appointment.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground col-span-2">
                  <Phone className="h-4 w-4 mr-2" />
                  {appointment.patientPhone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentPreview;