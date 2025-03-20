
import React from 'react';
import { Outlet } from 'react-router-dom';
import PatientSidebar from './PatientSidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

const PatientLayout = ({ className }) => {
  return (
    <div className="min-h-screen flex w-full">
      <PatientSidebar />
      
      <main className="flex-1 lg:ml-20 xl:ml-64 min-h-screen flex flex-col">
        <Header />
        
        <div className={cn("flex-1 p-6 md:p-8 animate-fade-in", className)}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;
