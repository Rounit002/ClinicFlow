
import React from 'react';
import { cn } from '@/lib/utils';

const PageTitle = ({ title, description, className }) => {
  return (
    <div className={cn("mb-8 animate-fade-in", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageTitle;
