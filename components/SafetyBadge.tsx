
import React from 'react';
import { SafetyStatus } from '../types';

interface SafetyBadgeProps {
  status: SafetyStatus;
  label: string;
}

const SafetyBadge: React.FC<SafetyBadgeProps> = ({ status, label }) => {
  const getColors = () => {
    switch (status) {
      case SafetyStatus.SAFE:
        return 'bg-green-100 text-green-800 border-green-200';
      case SafetyStatus.CAUTION:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case SafetyStatus.CONTRAINDICATED:
        return 'bg-red-100 text-red-800 border-red-200';
      case SafetyStatus.NOT_RECOMMENDED:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`flex flex-col items-center p-2 rounded-lg border ${getColors()} text-center transition-all`}>
      <span className="text-[10px] uppercase font-bold opacity-75">{label}</span>
      <span className="text-sm font-bold mt-0.5">{status}</span>
    </div>
  );
};

export default SafetyBadge;
