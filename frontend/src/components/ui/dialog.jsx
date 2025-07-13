import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const DialogContext = createContext();

const Dialog = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  
  const handleOpenChange = (newOpen) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => handleOpenChange(false)}
          />
        </div>
      )}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild, ...props }) => {
  const context = useContext(DialogContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        children.props.onClick?.(e);
        context?.onOpenChange(true);
      }
    });
  }

  return (
    <button
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        context?.onOpenChange(true);
      }}
    >
      {children}
    </button>
  );
};

const DialogContent = ({ children, className, ...props }) => {
  const context = useContext(DialogContext);
  
  if (!context?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={() => context?.onOpenChange(false)}
      />
      <div
        className={cn(
          'relative bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto',
          className
        )}
        {...props}
      >
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={() => context?.onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className, ...props }) => {
  return (
    <h2
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  );
};

const DialogDescription = ({ children, className, ...props }) => {
  return (
    <p
      className={cn('text-sm text-gray-600', className)}
      {...props}
    >
      {children}
    </p>
  );
};

const DialogFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};