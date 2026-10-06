import React from 'react';
import { ASSETS } from '../data/mockData';

interface HeroProps {
  onExplorePads: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePads }) => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center px-6 md:px-12 py-16 max-w-7xl mx-auto">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Hero Copy */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eae8e5] text-[#006c4f] text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c4f]" />
            Most Trusted &amp; Exported Quality
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#00231b] tracking-tight leading-[1.05]">
            Pure Evaporative Cooling.
          </h1>

          {/* 3 Visual Stat Badges */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-2">
            <div className="p-4 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] text-center hover:bg-white hover:shadow-md transition-all">
              <div className="text-3xl font-black text-[#00231b] tracking-tight">15°C</div>
              <div className="text-[11px] font-bold text-[#717975] uppercase tracking-wider mt-1">
                Temp Drop
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] text-center hover:bg-white hover:shadow-md transition-all">
              <div className="text-3xl font-black text-[#006c4f] tracking-tight">80%</div>
              <div className="text-[11px] font-bold text-[#717975] uppercase tracking-wider mt-1">
                Energy Saved
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] text-center hover:bg-white hover:shadow-md transition-all">
              <div className="text-3xl font-black text-[#00231b] tracking-tight">95%</div>
              <div className="text-[11px] font-bold text-[#717975] uppercase tracking-wider mt-1">
                Efficiency
              </div>
            </div>
          </div>

          {/* Single Clean CTA */}
          <div className="pt-2">
            <button
              onClick={onExplorePads}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#00231b] text-white text-sm font-bold tracking-wide uppercase hover:bg-[#006c4f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Explore Standard Pads</span>
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
            </button>
          </div>
        </div>

        {/* Prominent Hero Image */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full aspect-square max-w-[540px] rounded-3xl overflow-hidden shadow-2xl bg-[#efeeeb] group">
            <img
              alt="CelPad Evaporative Cooling Pad in lush biome"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={ASSETS.heroPad}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 backdrop-blur-md bg-white/90 px-4 py-2.5 rounded-xl border border-white/40 shadow-sm flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#006c4f] animate-pulse" />
              <span className="text-xs font-bold text-[#00231b] tracking-wide">
                Continuous Wetting Matrix
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
