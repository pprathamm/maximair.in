import React from 'react';
import { ASSETS } from '../data/mockData';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenInquire: () => void;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onNavigateCustomSizer: () => void;
  activeView: 'landing' | 'catalog' | 'product' | 'checkout';
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenInquire,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCustomSizer,
  activeView,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0e3a2f] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Brand Zone */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3.5 group cursor-pointer text-left bg-transparent border-0 p-0 focus:outline-none"
        >
          <img
            alt="MAXIMAIR Industrial Air Systems"
            className="h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            src={ASSETS.headerLogo}
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
              MAXIMAIR
            </span>
            <span className="text-[11px] font-semibold text-emerald-300 tracking-wider uppercase mt-0.5">
              Industrial Air Systems
            </span>
          </div>
        </button>

        {/* Action / Nav Zone */}
        <div className="flex items-center gap-6 md:gap-8 text-white font-medium text-sm">
          <button
            onClick={onNavigateProducts}
            className={`transition-colors cursor-pointer bg-transparent border-0 p-0 text-sm focus:outline-none ${
              activeView === 'catalog'
                ? 'text-[#59fdc5] font-bold'
                : 'text-white/90 hover:text-emerald-300 font-semibold'
            }`}
          >
            Products
          </button>

          <button
            onClick={onNavigateCustomSizer}
            className={`transition-colors cursor-pointer bg-transparent border-0 p-0 text-sm focus:outline-none ${
              activeView === 'product'
                ? 'text-[#59fdc5] font-bold'
                : 'text-white/90 hover:text-emerald-300 font-semibold'
            }`}
          >
            Custom
          </button>

          <button
            onClick={onOpenInquire}
            className="text-white/90 hover:text-emerald-300 font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0 text-sm focus:outline-none"
          >
            Inquire
          </button>

          {/* Cart Trigger */}
          <button
            aria-label={`Shopping Cart (${cartCount} items)`}
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer focus:outline-none"
          >
            <span className="material-symbols-outlined text-xl text-white">
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#59fdc5] text-[#00231b] text-[11px] font-black rounded-full flex items-center justify-center shadow-md border border-[#0e3a2f]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
