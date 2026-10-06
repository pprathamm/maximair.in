import React from 'react';
import { STANDARD_PRODUCTS } from '../data/mockData';
import { Product } from '../types';

interface ReadyToShipProductsProps {
  onOpenProductDetail: (product: Product) => void;
  onBrowseMoreProducts: () => void;
  onOpenCustomInquiry: () => void;
  onQuickAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ReadyToShipProducts: React.FC<ReadyToShipProductsProps> = ({
  onOpenProductDetail,
  onBrowseMoreProducts,
  onOpenCustomInquiry,
}) => {
  return (
    <section className="w-full py-24 bg-[#f5f3f0] px-6 md:px-12 border-y border-[#eae8e5]" id="products">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#006c4f] uppercase">
              Standard Sizes
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#00231b] tracking-tight mt-1">
              Ready-to-Ship Standard Sizes
            </h2>
          </div>

          <button
            onClick={onBrowseMoreProducts}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#eae8e5] bg-white text-xs font-bold uppercase tracking-wider text-[#00231b] hover:bg-[#efeeeb] hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span>Browse More Products</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STANDARD_PRODUCTS.map((prod) => {
            if (prod.isCustom) {
              return (
                <div
                  key={prod.id}
                  onClick={onOpenCustomInquiry}
                  className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-[#eae8e5] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-2xl bg-[#f5f3f0] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#eae8e5] flex items-center justify-center text-[#006c4f] mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">straighten</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#717975]">
                      Tailored Dimensions
                    </span>
                    <span className="text-xs font-semibold text-[#414845] mt-1">
                      Precision cut to your frame
                    </span>
                  </div>

                  <div className="pt-5 pb-1 flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#00231b]">Custom Size</h3>
                      <div className="text-sm font-semibold text-[#006c4f] mt-0.5">
                        Made to Order <span className="text-xs font-normal text-[#717975]">• Custom Quote</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCustomInquiry();
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#00231b] text-white text-xs font-bold tracking-wider uppercase text-center hover:bg-[#006c4f] transition-all inline-flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>Inquire Now</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={prod.id}
                onClick={() => onOpenProductDetail(prod)}
                className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-[#eae8e5] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className="relative w-full aspect-square rounded-2xl bg-[#f5f3f0] overflow-hidden">
                  <img
                    alt={prod.dimensions}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    src={prod.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#00231b]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                    {prod.flute}
                  </div>
                </div>

                <div className="pt-5 pb-1 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#00231b]">{prod.dimensions}</h3>
                    <div className="text-sm font-semibold text-[#006c4f] mt-0.5">
                      ₹{prod.price.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-[#717975]">/ unit</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProductDetail(prod);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#00231b] text-white text-xs font-bold tracking-wider uppercase text-center hover:bg-[#006c4f] transition-all active:scale-95 cursor-pointer"
                  >
                    Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
