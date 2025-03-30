import React, { useState } from 'react';
import { Plus, Search, Filter, User, Mail, Phone, Trash, Edit, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  lastVisit?: string;
}

interface PatientListProps {
  patients: Patient[];
  isLoading?: boolean;
  onAddPatient?: () => void;
  onEditPatient?: (patient: Patient) => void;
  onDeletePatient?: (patient: Patient) => void;
  className?: string;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  isLoading = false,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const filteredPatients = patients.filter((patient) => 
    (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.phone || '').includes(searchTerm)
  );  

  const toggleDropdown = (patientId: string) => {
    if (activeDropdown === patientId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(patientId);
    }
  };

  return (
    <div className={cn("bg-gradient-to-br from-white to-clinic-50 rounded-xl shadow-elevation-1 animate-scale-in overflow-hidden", className)}>
      <div className="p-6 border-b border-clinic-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-medium text-clinic-800">Patient Records</h3>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clinic-600" />
              <input 
                type="text" 
                placeholder="Search patients..." 
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-clinic-50 border border-clinic-200 text-black placeholder-clinic-600 focus:outline-none focus:ring-2 focus:ring-clinic-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="h-9 px-3 rounded-lg border border-clinic-200 hover:bg-clinic-100 transition-colors">
              <Filter className="h-4 w-4 text-clinic-600" />
            </button>
            
            <button 
              className="h-9 px-4 rounded-lg bg-gradient-to-r from-clinic-400 to-clinic-600 text-white flex items-center gap-1 hover:from-clinic-500 hover:to-clinic-700 transition-all ripple"
              onClick={onAddPatient}
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="mx-auto h-12 w-12 rounded-full border-4 border-clinic-200 border-t-clinic-600 mb-3"
          />
          <h3 className="text-lg font-medium text-clinic-800 mb-1">Loading patients...</h3>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-12">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
            <User className="h-12 w-12 mx-auto text-clinic-400 mb-3" />
          </motion.div>
          <h3 className="text-lg font-medium text-clinic-800 mb-1">No patients found</h3>
          <p className="text-sm text-black">
            {searchTerm ? "Try different search terms" : "Add your first patient to get started"}
          </p>
          {!searchTerm && (
            <button 
              className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-clinic-400 to-clinic-600 text-white flex items-center gap-2 hover:from-clinic-500 hover:to-clinic-700 transition-all ripple mx-auto"
              onClick={onAddPatient}
            >
              <Plus className="h-4 w-4" />
              <span>Add Patient</span>
            </button>
          )}
        </div>
      ) : isMobile ? (
        // Mobile view: Card-based layout
        <div className="p-4 space-y-4">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 border border-clinic-200 rounded-lg shadow-sm hover:bg-clinic-100/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-8 w-8 rounded-full bg-clinic-50 flex items-center justify-center mr-3"
                  >
                    <User className="h-4 w-4 text-clinic-600" />
                  </motion.div>
                  <span className="font-medium text-black">{patient.name}</span>
                </div>
                <div className="relative">
                  <button 
                    className="h-8 w-8 rounded-md hover:bg-clinic-100 flex items-center justify-center transition-all ripple"
                    onClick={() => toggleDropdown(patient.id)}
                  >
                    <MoreHorizontal className="h-4 w-4 text-clinic-600" />
                  </button>
                  {activeDropdown === patient.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-white shadow-elevation-2 border border-clinic-200 z-50">
                        <div className="py-1">
                          <button
                            className="w-full px-4 py-2 text-left text-sm flex items-center text-black hover:bg-clinic-50 transition-all"
                            onClick={() => {
                              onEditPatient?.(patient);
                              setActiveDropdown(null);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2 text-clinic-600" />
                            Edit Patient
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm flex items-center text-black hover:bg-clinic-50 transition-all"
                            onClick={() => {
                              onDeletePatient?.(patient);
                              setActiveDropdown(null);
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2 text-clinic-600" />
                            Delete Patient
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Mail className="h-3 w-3 mr-2 text-clinic-600" />
                  </motion.div>
                  <span className="text-black">{patient.email}</span>
                </div>
                <div className="flex items-center">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Phone className="h-3 w-3 mr-2 text-clinic-600" />
                  </motion.div>
                  <span className="text-black">{patient.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Age: </span>
                  <span className="text-black">{patient.age}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Gender: </span>
                  <span className="text-black">{patient.gender}</span>
                </div>
                <div>
                  <span className="font-medium text-black">Last Visit: </span>
                  <span className="text-black">
                    {patient.lastVisit || "No visits"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Desktop view: Table layout
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-clinic-200 bg-clinic-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-clinic-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-clinic-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-clinic-600 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-clinic-600 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-clinic-600 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-clinic-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinic-200">
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:bg-clinic-100/20 transition-all"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="h-8 w-8 rounded-full bg-clinic-50 flex items-center justify-center mr-3"
                      >
                        <User className="h-4 w-4 text-clinic-600" />
                      </motion.div>
                      <span className="font-medium text-black">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Mail className="h-3 w-3 mr-2 text-clinic-600" />
                        </motion.div>
                        <span className="text-black">{patient.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Phone className="h-3 w-3 mr-2 text-clinic-600" />
                        </motion.div>
                        <span className="text-black">{patient.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {patient.lastVisit || "No visits"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button 
                        className="h-8 w-8 rounded-md hover:bg-clinic-100 flex items-center justify-center transition-all ripple"
                        onClick={() => toggleDropdown(patient.id)}
                      >
                        <MoreHorizontal className="h-4 w-4 text-clinic-600" />
                      </button>
                      {activeDropdown === patient.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-white shadow-elevation-2 border border-clinic-200 z-50">
                            <div className="py-1">
                              <button
                                className="w-full px-4 py-2 text-left text-sm flex items-center text-black hover:bg-clinic-50 transition-all"
                                onClick={() => {
                                  onEditPatient?.(patient);
                                  setActiveDropdown(null);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2 text-clinic-600" />
                                Edit Patient
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm flex items-center text-black hover:bg-clinic-50 transition-all"
                                onClick={() => {
                                  onDeletePatient?.(patient);
                                  setActiveDropdown(null);
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2 text-clinic-600" />
                                Delete Patient
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;