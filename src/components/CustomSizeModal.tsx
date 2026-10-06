import React, { useState, useEffect } from 'react';

interface CustomSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CustomInquiryData) => void;
  initialHeight?: number;
  initialDepth?: string;
}

export interface CustomInquiryData {
  height: number;
  width: number;
  depth: string;
  flute: string;
  coating: string;
  quantity: number;
  phone: string;
  email: string;
  notes?: string;
}

export const CustomSizeModal: React.FC<CustomSizeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialHeight = 1800,
  initialDepth = '100 mm',
}) => {
  const [height, setHeight] = useState<number>(initialHeight);
  const [width, setWidth] = useState<number>(600);
  const [depth, setDepth] = useState<string>(initialDepth);
  const [flute, setFlute] = useState<string>('7090 (45°×45°) Standard Flute');
  const [coating, setCoating] = useState<string>('Standard Kraft Brown');
  const [quantity, setQuantity] = useState<number>(20);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setHeight(initialHeight);
      setDepth(initialDepth);
    }
  }, [isOpen, initialHeight, initialDepth]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      height,
      width,
      depth,
      flute,
      coating,
      quantity,
      phone,
      email,
      notes,
    });
  };

  const calculatedTotalArea = ((height * width * quantity) / 1000000).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-[#eae8e5] animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#eae8e5]">
          <div>
            <h3 className="text-xl font-extrabold text-[#00231b]">
              Custom Dimension Inquiry
            </h3>
            <p className="text-xs text-[#717975] mt-0.5">
              Precision cut to exact mm for greenhouse &amp; HVAC frames
            </p>
          </div>
          <button
            aria-label="Close dialog"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f5f3f0] hover:bg-[#eae8e5] flex items-center justify-center text-[#00231b] transition active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Height (mm)
              </label>
              <input
                type="number"
                min="300"
                max="3000"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                placeholder="e.g. 1800"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none font-bold text-[#00231b]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Width (mm)
              </label>
              <input
                type="number"
                min="200"
                max="1000"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                placeholder="e.g. 600"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none font-bold text-[#00231b]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Depth (mm)
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none font-bold text-[#00231b]"
              >
                <option value="100 mm">100 mm (Standard)</option>
                <option value="150 mm">150 mm (High Saturation)</option>
                <option value="200 mm">200 mm (Turbine/AHU)</option>
                <option value="50 mm">50 mm (Compact)</option>
              </select>
            </div>
          </div>

          {/* Flute geometry & coating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Flute Series
              </label>
              <select
                value={flute}
                onChange={(e) => setFlute(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none font-medium text-[#00231b]"
              >
                <option value="7090 (45°×45°) Standard Flute">CelPad 7090 (45°×45°)</option>
                <option value="5090 (60°×30°) High Velocity">CelPad 5090 (60°×30°)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Pad Coating / Edge
              </label>
              <select
                value={coating}
                onChange={(e) => setCoating(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none font-medium text-[#00231b]"
              >
                <option value="Standard Kraft Brown">Standard Kraft Brown</option>
                <option value="Black-Edge™ Anti-Algae Coating">Black-Edge™ Anti-Algae Coating</option>
                <option value="Green Algae-Shield Coating">Green Algae-Shield Coating</option>
              </select>
            </div>
          </div>

          {/* Quantity & Area Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Quantity (Units)
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                placeholder="e.g. 50"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none font-bold text-[#00231b]"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-[#bfecdc]/30 border border-[#a4d0c0] text-xs text-[#002018]">
              <span className="font-bold">Total Wall Area:</span> {calculatedTotalArea} m²
              <span className="text-[10px] block text-[#254e42] mt-0.5">
                ({height} × {width} mm × {quantity} pads)
              </span>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98250 XXXXX"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none text-[#00231b]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none text-[#00231b]"
              />
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#717975] mb-1">
              Application Details / Frame Specs (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Polyhouse pad wall retrofitting, rooftop AHU unit, high mineral water supply..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#eae8e5] bg-[#f5f3f0] focus:ring-2 focus:ring-[#006c4f] focus:outline-none text-[#00231b]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00231b] hover:bg-[#006c4f] text-white text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Submit Custom Sizing Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
