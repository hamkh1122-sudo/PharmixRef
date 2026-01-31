
import React from 'react';
import { Medicine, DoseRoute } from '../types';
import SafetyBadge from './SafetyBadge';

interface MedicineDetailProps {
  medicine: Medicine;
  onBack: () => void;
}

const MedicineDetail: React.FC<MedicineDetailProps> = ({ medicine, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 font-bold text-sm uppercase tracking-wider hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Clinical Search
        </button>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Offline Ready
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        {/* Header Section */}
        <div className={`p-6 text-white ${medicine.emergencyUse ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-inner' : 'bg-gradient-to-r from-slate-800 to-slate-900 shadow-inner'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold tracking-tight">{medicine.name}</h1>
                {!medicine.isVerified && (
                  <span className="bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Experimental (AI)</span>
                )}
                {medicine.emergencyUse && (
                  <span className="bg-white text-red-600 text-[8px] font-black px-2 py-0.5 rounded uppercase shadow-sm tracking-wider">Emergency Protocol</span>
                )}
              </div>
              <p className="text-blue-100 font-bold opacity-90 text-sm uppercase tracking-wide">{medicine.class}</p>
              <div className="mt-2 text-xs opacity-70 italic font-medium">
                Also known as: {medicine.brandNames.join(', ')}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">Protocol Reference</p>
              <p className="text-xs font-bold">{medicine.source}</p>
            </div>
          </div>
        </div>

        {/* Safety Overview */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SafetyBadge label="Adult Use" status={medicine.safetyFlags.adults} />
            <SafetyBadge label="Pediatric Use" status={medicine.safetyFlags.pediatrics} />
            <SafetyBadge label="Pregnancy (OB)" status={medicine.safetyFlags.pregnancy} />
            <SafetyBadge label="Geriatric Use" status={medicine.safetyFlags.elderly} />
          </div>
        </div>

        {/* Clinical Sections */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Dosing */}
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Adult Dosing</h2>
              </div>
              <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400">Standard Dose</label>
                    <p className="text-lg font-black text-blue-900 leading-tight">{medicine.adultDose.standard}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400">Frequency</label>
                    <p className="text-lg font-black text-blue-900 leading-tight">{medicine.adultDose.frequency}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-[10px] uppercase font-black text-slate-400">Maximum Daily Limit</label>
                  <p className="text-md font-black text-red-700 bg-red-50 inline-block px-3 py-1 rounded-lg border border-red-100">{medicine.adultDose.maximum}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400">Admin Routes</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {medicine.adultDose.route.map(r => (
                      <span key={r} className="text-[10px] bg-white px-2 py-1 rounded border border-blue-200 text-blue-700 font-black uppercase">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Pediatric Dosing</h2>
              </div>
              <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100 shadow-sm">
                {medicine.pediatricDose.weightBased && (
                  <div className="mb-4">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Weight-Based Calc (mg/kg)</label>
                    <p className="text-2xl font-black text-purple-900 italic tracking-tighter">{medicine.pediatricDose.weightBased}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400">Reference Dose</label>
                    <p className="font-bold text-slate-700">{medicine.pediatricDose.standard}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400">Safety Cap</label>
                    <p className="font-black text-red-600">{medicine.pediatricDose.maximum}</p>
                  </div>
                </div>
                {medicine.pediatricDose.ageRestrictions && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800 font-medium">
                    <span className="font-black uppercase text-[10px] block mb-1">Critical Age Thresholds</span>
                    {medicine.pediatricDose.ageRestrictions}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Clinical Safety */}
          <div className="space-y-6">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-slate-200"></span>
                Indications
              </h3>
              <ul className="space-y-2">
                {medicine.indications.map((ind, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                    {ind}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-red-100"></span>
                Contraindications
              </h3>
              <ul className="space-y-2">
                {medicine.contraindications.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0"></span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-amber-100"></span>
                Precautions
              </h3>
              <ul className="space-y-2">
                {medicine.precautions.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-slate-200"></span>
                Adverse Reactions
              </h3>
              <div className="flex flex-wrap gap-2">
                {medicine.sideEffects.map((s, i) => (
                  <span key={i} className="text-[10px] font-bold bg-slate-50 px-2.5 py-1.5 rounded-lg text-slate-600 border border-slate-200 uppercase">{s}</span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer/Meta */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-[9px] text-slate-400 text-center uppercase tracking-widest font-black flex items-center justify-center gap-4">
          <span>Clinical ID: {medicine.id}</span>
          <span>•</span>
          <span>Protocol Level: Advanced</span>
          <span>•</span>
          <span>Integrity: Validated</span>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;
