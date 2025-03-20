import React, { useState } from 'react';
import { Plus, Search, Filter, User, Mail, Phone, Trash, Edit, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className={cn("bg-white rounded-2xl border shadow-elevation-1 animate-scale-in overflow-hidden", className)}>
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-medium">Patient Records</h3>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search patients..." 
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-background border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="h-9 px-3 rounded-lg border hover:bg-muted transition-colors">
              <Filter className="h-4 w-4" />
            </button>
            
            <button 
              className="h-9 px-4 rounded-lg bg-clinic-600 text-white flex items-center gap-1 hover:bg-clinic-700 transition-colors"
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
          <div className="animate-pulse mx-auto h-12 w-12 rounded-full bg-muted mb-3"></div>
          <h3 className="text-lg font-medium mb-1">Loading patients...</h3>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium mb-1">No patients found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Try different search terms" : "Add your first patient to get started"}
          </p>
          {!searchTerm && (
            <button 
              className="mt-4 px-4 py-2 rounded-lg bg-clinic-600 text-white flex items-center gap-2 hover:bg-clinic-700 transition-colors mx-auto"
              onClick={onAddPatient}
            >
              <Plus className="h-4 w-4" />
              <span>Add Patient</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-clinic-50 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-clinic-600" />
                      </div>
                      <span className="font-medium">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {patient.lastVisit || "No visits"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button 
                        className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                        onClick={() => toggleDropdown(patient.id)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {activeDropdown === patient.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-white shadow-elevation-2 border z-50">
                            <div className="py-1">
                              <button
                                className="w-full px-4 py-2 text-left text-sm flex items-center hover:bg-muted transition-colors"
                                onClick={() => {
                                  onEditPatient?.(patient);
                                  setActiveDropdown(null);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Patient
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm flex items-center text-red-600 hover:bg-muted transition-colors"
                                onClick={() => {
                                  onDeletePatient?.(patient);
                                  setActiveDropdown(null);
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Patient
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;
