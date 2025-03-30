import React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
  logo?: string; // New prop for logo/icon
  titleClassName?: string; // Added prop for custom title styling
  descriptionClassName?: string; // Added prop for custom description styling
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  description,
  className,
  logo,
  titleClassName = '', // Default to empty string to avoid undefined
  descriptionClassName = '', // Default to empty string to avoid undefined
}) => {
  return (
    <div className={cn("mb-8 animate-fade-in", className)}>
      <div className="flex items-center gap-3">
        {logo && <img src={logo} alt="Clinic Logo" className="h-10 w-10" />}
        <h1
          className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700",
            titleClassName // Allow custom title styling
          )}
        >
          {title}
        </h1>
      </div>
      {description && (
        <p
          className={cn(
            "mt-2 text-muted-foreground relative inline-block",
            descriptionClassName // Allow custom description styling
          )}
        >
          {description}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-orange-400" />
        </p>
      )}
    </div>
  );
};

export default PageTitle;