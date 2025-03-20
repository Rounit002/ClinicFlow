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

  // Mock time slots
  const availableTimeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("User not logged in!");
          return;
        }

        const response = await fetch("http://localhost:3000/api/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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

    if (!user) {
      toast.error("User data is missing!");
      return;
    }

    const token = localStorage.getItem("token"); // ✅ Fix missing token declaration
    if (!token) {
      toast.error("Authentication token is missing!");
      return;
    }

    const appointmentData = {
      booked_by: user.id,  // Ensure user is defined
      patient_name: patientName,
      patient_phone: patientPhone,
      date: date ? format(date, "yyyy-MM-dd") : null, // Format date correctly
      appointment_time: timeSlot, // ✅ Fix incorrect reference (was 'time')
      doctor_type: doctorType,
      reason,
    };

    console.log("📤 Sending appointment data:", appointmentData); // Debugging log

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();
      console.log("🔍 API Response:", data);

      if (!response.ok) throw new Error(data.error || "Failed to book appointment");

      toast.success("Appointment booked successfully!");
      navigate("/patient/dashboard");
    } catch (error) {
      console.error("❌ Error booking appointment:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageTitle 
        title="Book Appointment" 
        description="Select your preferred date and time for your appointment."
      />
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-8 border shadow-elevation-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient's Name</label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Patient's Phone Number</label>
                <Input
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="Enter patient's phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Appointment Type</label>
                <Select value={doctorType} onValueChange={setDoctorType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialist type" />
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
                <label className="block text-sm font-medium mb-1">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                <label className="block text-sm font-medium mb-1">Select Time Slot</label>
                <Select value={timeSlot} onValueChange={setTimeSlot} disabled={!date}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select available time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Visit (Optional)</label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms or reason"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-clinic-600 hover:bg-clinic-700" disabled={isLoading}>
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
