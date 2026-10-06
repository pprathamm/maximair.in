import React, { useState } from 'react';
import { SPECIFICATIONS } from '../data/mockData';

export const SpecificationsTable: React.FC = () => {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  return (
    <section className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto" id="matrix">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#006c4f] uppercase">
              Engineering Matrix
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#00231b] tracking-tight mt-1">
              Specifications
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#717975]">
            Tested under AMCA 210 Standard Airflow Conditions
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-3xl border border-[#eae8e5] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f5f3f0] text-xs uppercase tracking-wider font-bold text-[#717975]">
              <tr>
                <th className="py-4 px-6">Flute Series</th>
                <th className="py-4 px-6">Pitch</th>
                <th className="py-4 px-6">Face Velocity</th>
                <th className="py-4 px-6">Efficiency</th>
                <th className="py-4 px-6">Pressure Drop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e5] font-medium text-[#1b1c1a]">
              {SPECIFICATIONS.map((spec) => {
                const isSelected = selectedSeries === spec.series;
                return (
                  <tr
                    key={spec.series}
                    onClick={() => setSelectedSeries(isSelected ? null : spec.series)}
                    className={`hover:bg-[#f5f3f0]/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#bfecdc]/20' : ''
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-[#00231b] flex items-center gap-2">
                      <span>{spec.series}</span>
                      <span className="material-symbols-outlined text-xs text-[#717975]">
                        {isSelected ? 'expand_less' : 'info'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#414845]">{spec.pitch}</td>
                    <td className="py-4 px-6 text-[#414845]">{spec.faceVelocity}</td>
                    <td className="py-4 px-6 font-bold text-[#006c4f]">{spec.efficiency}</td>
                    <td className="py-4 px-6 text-[#414845]">{spec.pressureDrop}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Detail Card on row click */}
        {selectedSeries && (
          <div className="p-6 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006c4f]">
                  Application Guidance
                </span>
                <span className="text-xs font-bold text-[#00231b]">· {selectedSeries}</span>
              </div>
              <p className="text-sm text-[#414845] mt-1 font-medium">
                {SPECIFICATIONS.find((s) => s.series === selectedSeries)?.applications}
              </p>
            </div>
            <button
              onClick={() => setSelectedSeries(null)}
              className="text-xs font-bold text-[#717975] hover:text-[#00231b] transition-colors uppercase tracking-wider"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
