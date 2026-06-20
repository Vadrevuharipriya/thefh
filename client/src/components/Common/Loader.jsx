import React from 'react';

export default function Loader({ fullScreen = false }) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-brand-red/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-gold rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-brand-red font-heading font-semibold text-lg tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/80 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      {loaderContent}
    </div>
  );
}
