import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [doctorType, setDoctorType] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const availableTimeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("User not logged in!");
        const response = await fetch("https://clinicflow-e7a9.onrender.com/api/auth/user", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch user");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("User data is missing!");
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Authentication token is missing!");

    const appointmentData = {
      booked_by: user.id,
      patient_name: patientName,
      patient_phone: patientPhone,
      date: date ? format(date, "yyyy-MM-dd") : null,
      appointment_time: timeSlot,
      doctor_type: doctorType,
      reason,
    };

    try {
      setIsLoading(true);
      const response = await fetch("https://clinicflow-e7a9.onrender.com/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(appointmentData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to book appointment");
      toast.success("Appointment booked successfully!");
      navigate("/patient/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen p-6 md:p-8"
      style={{ background: 'linear-gradient(135deg, #F7FAFF, #F0F7FF)' }} // clinic-50 to clinic-100
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/30" />

      <div className="relative z-10 max-w-lg mx-auto">
        <PageTitle
          title="Book Appointment"
          description="Select your preferred date and time."
          titleClassName="text-clinic-800"
          descriptionClassName="text-black"
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-clinic-200 shadow-md"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-clinic-800">Patient's Name</label>
                <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                  <Input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient's full name"
                    required
                    className="w-full text-black placeholder-clinic-800 focus:ring-2 focus:ring-clinic-400 border-clinic-200 ripple"
                  />
                </motion.div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-clinic-800">Patient's Phone Number</label>
                <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                  <Input
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="Enter patient's phone number"
                    required
                    className="w-full text-black placeholder-clinic-800 focus:ring-2 focus:ring-clinic-400 border-clinic-200 ripple"
                  />
                </motion.div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-clinic-800">Appointment Type</label>
                <Select value={doctorType} onValueChange={setDoctorType}>
                  <SelectTrigger className="w-full text-black focus:ring-2 focus:ring-clinic-400 border-clinic-200 ripple">
                    <SelectValue placeholder="Select specialist type" className="text-clinic-800" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Physician</SelectItem>
                    <SelectItem value="dental">Dental Specialist</SelectItem>
                    <SelectItem value="cardiology">Cardiologist</SelectItem>
                    <SelectItem value="dermatology">Dermatologist</SelectItem>
                    <SelectItem value="pediatric">Pediatrician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-clinic-800">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-black border-clinic-200 hover:bg-clinic-50 ripple",
                        !date && "text-clinic-800"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-clinic-600" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-clinic-800">Select Time Slot</label>
                <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date}>
                  <SelectTrigger className="w-full text-black focus:ring-2 focus:ring-clinic-400 border-clinic-200 ripple">
                    <SelectValue placeholder="Select available time" className="text-clinic-800" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-clinic-800">Reason for Visit (Optional)</label>
                <motion.div whileHover={{ scale: 1.02 }} whileFocus={{ scale: 1.05 }}>
                  <Input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms or reason"
                    className="w-full text-black placeholder-clinic-800 focus:ring-2 focus:ring-clinic-400 border-clinic-200 ripple"
                  />
                </motion.div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="w-full bg-clinic-600 hover:bg-clinic-700 text-white text-lg ripple"
                disabled={isLoading}
              >
                {isLoading ? "Booking..." : "Book Appointment"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookAppointment;