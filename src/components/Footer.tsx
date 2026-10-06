import React from 'react';
import { ASSETS } from '../data/mockData';

interface FooterProps {
  onOpenInquire: () => void;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onNavigateCustomSizer: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenInquire,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCustomSizer,
}) => {
  return (
    <footer className="w-full bg-[#f5f3f0] border-t border-[#eae8e5] py-10 px-6 md:px-12 text-xs text-[#414845] mt-auto">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 font-bold text-[#00231b] hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-0 p-0 text-left"
          title="MAXIMAIR Home"
        >
          <img
            alt="MAXIMAIR"
            className="h-6 w-auto object-contain"
            src={ASSETS.footerLogo}
            referrerPolicy="no-referrer"
          />
          <span className="text-sm font-extrabold tracking-tight text-[#00231b]">
            MAXIMAIR
          </span>
        </button>

        {/* Links */}
        <div className="flex items-center gap-6 flex-wrap justify-center font-medium">
          <button
            onClick={onNavigateProducts}
            className="hover:text-[#00231b] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-medium text-[#414845]"
          >
            Products
          </button>
          <button
            onClick={onNavigateCustomSizer}
            className="hover:text-[#00231b] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-medium text-[#414845]"
          >
            Custom
          </button>
          <button
            onClick={onOpenInquire}
            className="hover:text-[#00231b] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-medium text-[#414845]"
          >
            Inquire
          </button>
          <a
            className="hover:text-[#00231b] transition-colors cursor-pointer"
            href="https://wa.me/919825141727"
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
          <a
            className="hover:text-[#00231b] transition-colors cursor-pointer"
            href="mailto:sales@celpad.in"
          >
            sales@celpad.in
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#414845]">
          © 2025 MAXIMAIR Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
