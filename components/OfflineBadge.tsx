
import React from 'react';

interface OfflineBadgeProps {
  isOnline: boolean;
}

const OfflineBadge: React.FC<OfflineBadgeProps> = ({ isOnline }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-slate-400'}`}></div>
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
        {isOnline ? 'Live Network' : 'Offline Mode'}
      </span>
    </div>
  );
};

export default OfflineBadge;
