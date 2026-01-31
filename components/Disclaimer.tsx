
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">Medical Disclaimer</h3>
          <div className="mt-1 text-sm text-red-700 leading-relaxed">
            <p>
              This application is for <strong>educational and reference purposes only</strong>. While we strive for clinical accuracy based on WHO, BNF, and FDA guidelines, dosages provided must be independently verified with the latest institutional protocols and official drug labeling before administration. 
            </p>
            <p className="mt-2 font-semibold">
              The developer assumes no liability for errors or medical decisions made based on this tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
