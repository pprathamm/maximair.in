import React from 'react';
import { FeatureDetail } from '../types';

interface FeatureModalProps {
  feature: FeatureDetail | null;
  onClose: () => void;
  onInquire: () => void;
}

export const FeatureModal: React.FC<FeatureModalProps> = ({
  feature,
  onClose,
  onInquire,
}) => {
  if (!feature) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-[#eae8e5] animate-in zoom-in-95 duration-200 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#eae8e5]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#bfecdc] flex items-center justify-center text-[#006c4f]">
              <span className="material-symbols-outlined text-2xl">
                {feature.icon}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#006c4f] uppercase tracking-wider">
                Thermodynamic Flute Feature
              </span>
              <h3 className="text-xl font-extrabold text-[#00231b]">
                {feature.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f5f3f0] hover:bg-[#eae8e5] flex items-center justify-center text-[#00231b] transition active:scale-90"
            aria-label="Close feature modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#00231b] leading-relaxed">
            {feature.shortDesc}
          </p>
          <p className="text-xs text-[#717975] leading-relaxed">
            {feature.fullDesc}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717975]">
              Technical Validation Specs
            </span>
            <div className="rounded-2xl bg-[#f5f3f0] p-4 border border-[#eae8e5] space-y-2.5">
              {feature.specs.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="font-semibold text-[#414845]">{item.label}</span>
                  <span className="font-bold text-[#006c4f] text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={() => {
              onClose();
              onInquire();
            }}
            className="flex-1 py-3 rounded-xl bg-[#00231b] hover:bg-[#006c4f] text-white text-xs font-bold uppercase tracking-wider transition text-center shadow-md active:scale-95 cursor-pointer"
          >
            Consult Engineering Team
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-[#eae8e5] text-xs font-bold text-[#717975] hover:text-[#00231b] hover:bg-[#f5f3f0] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
