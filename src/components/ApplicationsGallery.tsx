import React, { useRef } from 'react';
import { APPLICATIONS } from '../data/mockData';
import { ApplicationItem } from '../types';

interface ApplicationsGalleryProps {
  onSelectApplication?: (app: ApplicationItem) => void;
}

export const ApplicationsGallery: React.FC<ApplicationsGalleryProps> = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75 * direction;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto" id="applications">
      <div className="space-y-6">
        {/* Header with Navigation Chevrons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-[#006c4f] uppercase">
              Engineered Environments
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#00231b] tracking-tight">
              Applications
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                aria-label="Previous Application"
                onClick={() => scroll(-1)}
                className="w-11 h-11 rounded-full border border-[#eae8e5] bg-white text-[#00231b] hover:bg-[#efeeeb] hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button
                aria-label="Next Application"
                onClick={() => scroll(1)}
                className="w-11 h-11 rounded-full border border-[#eae8e5] bg-white text-[#00231b] hover:bg-[#efeeeb] hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6 md:-mx-12 md:px-12 select-none"
        >
          {APPLICATIONS.map((item) => (
            <div
              key={item.id}
              className="min-w-[85vw] sm:min-w-[580px] lg:min-w-[720px] h-[460px] md:h-[540px] relative rounded-3xl overflow-hidden shadow-xl snap-center group flex-shrink-0"
            >
              <img
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                src={item.image}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00231b]/90 via-[#00231b]/20 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                <div>
                  <span className="text-xs font-bold tracking-widest text-[#59fdc5] uppercase">
                    {item.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/80 max-w-lg mt-2 font-normal hidden sm:block">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center shrink-0">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold border border-white/20">
                    {item.metric}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
