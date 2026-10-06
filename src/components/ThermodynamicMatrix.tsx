import React, { useState } from 'react';
import { ASSETS, FEATURES } from '../data/mockData';
import { FeatureDetail } from '../types';

interface ThermodynamicMatrixProps {
  onSelectFeature: (feature: FeatureDetail) => void;
}

export const ThermodynamicMatrix: React.FC<ThermodynamicMatrixProps> = ({
  onSelectFeature,
}) => {
  const [isDiagramExpanded, setIsDiagramExpanded] = useState(false);

  return (
    <section className="w-full py-24 bg-[#f5f3f0] px-6 md:px-12 border-y border-[#eae8e5]" id="science">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#006c4f] uppercase">
              Thermodynamic Matrix
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#00231b] tracking-tight mt-1">
              Cross-Corrugated Geometry
            </h2>
          </div>
          <span className="text-sm font-semibold text-[#717975] tracking-wide">
            7090 • 5090 Wave
          </span>
        </div>

        {/* Visual Schematic + Feature Chips */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Realistic Schematic Breakdown */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl bg-white relative group cursor-pointer"
               onClick={() => setIsDiagramExpanded(true)}>
            <img
              alt="High Efficiency Honeycomb Evaporative Cooling Pad Dynamic Breakdown Diagram"
              className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              src={ASSETS.schematicBreakdown}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-[#00231b]/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-sm text-[#59fdc5]">zoom_in</span>
              <span>Click to Enlarge Breakdown</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-sm text-xs text-[#414845] flex items-center justify-between">
              <span className="font-semibold text-[#00231b]">Dual Flute Intersecting System</span>
              <span className="text-[#006c4f] font-bold">45° / 45° Optimal Saturation Angle</span>
            </div>
          </div>

          {/* 4 Feature Chips */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                onClick={() => onSelectFeature(feature)}
                className="p-8 rounded-3xl bg-white border border-[#eae8e5] flex flex-col justify-between aspect-square hover:shadow-xl hover:-translate-y-1 transition-all shadow-sm cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectFeature(feature);
                  }
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#efeeeb] group-hover:bg-[#bfecdc] flex items-center justify-center text-[#006c4f] transition-colors">
                  <span className="material-symbols-outlined text-4xl text-[#006c4f]">
                    {feature.icon}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="text-xl md:text-2xl font-extrabold text-[#00231b] tracking-tight leading-snug">
                    {feature.title.split(' ')[0]}<br />{feature.title.split(' ').slice(1).join(' ')}
                  </div>
                  <div className="text-[11px] font-semibold text-[#006c4f] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect Specs</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Diagram Modal */}
      {isDiagramExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setIsDiagramExpanded(false)}
        >
          <div
            className="bg-white rounded-3xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] flex flex-col items-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center pb-3 border-b border-[#eae8e5]">
              <div>
                <h3 className="font-extrabold text-lg text-[#00231b]">High Efficiency Honeycomb Cooling Pad Architecture</h3>
                <p className="text-xs text-[#717975]">Cross-corrugated flute geometry, air-water interaction pathways, and latent heat evaporation zone</p>
              </div>
              <button
                onClick={() => setIsDiagramExpanded(false)}
                className="w-9 h-9 rounded-full bg-[#f5f3f0] hover:bg-[#eae8e5] flex items-center justify-center text-[#00231b] transition-colors"
                aria-label="Close diagram modal"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="overflow-auto w-full flex justify-center py-4">
              <img
                src={ASSETS.schematicBreakdown}
                alt="Diagram Schematic Full View"
                referrerPolicy="no-referrer"
                className="max-h-[70vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
