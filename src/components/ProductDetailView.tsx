import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { ASSETS } from '../data/mockData';
import { handleImageError } from '../utils/imageUtils';

interface ProductDetailViewProps {
  initialProduct?: Product;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onAddToCart: (product: Product, quantity: number, edgeCoating: string) => void;
  onOpenCart: () => void;
  onProceedToCheckout: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

const GALLERY_ITEMS = [
  {
    index: 1,
    label: 'Virgin Kraft 100g',
    mainSrc:
      ASSETS.heroPad,
    altSrc:
      ASSETS.detailMain,
    thumbSrc:
      ASSETS.product1800,
    alt: 'View 1 - Main Product',
  },
  {
    index: 2,
    label: 'Eco Flute Structure',
    mainSrc:
      ASSETS.schematicBreakdown,
    thumbSrc:
      ASSETS.product1500,
    alt: 'View 2 - Flute Architecture',
  },
  {
    index: 3,
    label: 'Airflow & Saturation',
    mainSrc:
      ASSETS.detailMain,
    thumbSrc:
      ASSETS.product2000,
    alt: 'View 3 - Air & Water Flow',
  },
  {
    index: 4,
    label: 'Installation Environment',
    mainSrc:
      ASSETS.appGreenhouse,
    thumbSrc:
      ASSETS.appGreenhouse,
    alt: 'View 4 - Industrial Application',
  },
];

const FINISH_SWATCHES = [
  { name: 'Virgin Kraft', color: '#9c6f44', delta: 0 },
  { name: 'Anti-Algae Green', color: '#2e6f40', delta: 90 },
  { name: 'Carbon Coated', color: '#2d3134', delta: 120 },
  { name: 'Terracotta', color: '#a34b2f', delta: 50 },
];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  initialProduct,
  onNavigateHome,
  onNavigateProducts,
  onAddToCart,
  onOpenCart,
  onProceedToCheckout,
  onShowToast,
}) => {
  // Gallery state
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(1);
  const [activeImageSrc, setActiveImageSrc] = useState<string>(GALLERY_ITEMS[0].mainSrc);
  const [imgFading, setImgFading] = useState<boolean>(false);

  // Configurator state (defaults to 1800 x 600 x 150 mm)
  const [height, setHeight] = useState<number>(initialProduct?.height || 1800);
  const [width, setWidth] = useState<number>(initialProduct?.width || 600);
  const [depth, setDepth] = useState<number>(initialProduct?.depth || 150);

  const [angle, setAngle] = useState<'45° × 45°' | '60° × 30°'>('45° × 45°');
  const [fluteHeight, setFluteHeight] = useState<'5 mm' | '7 mm'>('7 mm');
  const [finish, setFinish] = useState<string>('Virgin Kraft');
  const [qty, setQty] = useState<number>(1);

  // Comparison tab state
  const [comparisonModel, setComparisonModel] = useState<'7090' | '5090'>('7090');

  // Local slide confirmation toast state (matches bottom-right confirmation in HTML)
  const [slideToast, setSlideToast] = useState<{
    visible: boolean;
    title: string;
    subtitle: string;
  }>({
    visible: false,
    title: '',
    subtitle: '',
  });

  useEffect(() => {
    if (initialProduct) {
      setHeight(Math.min(2000, Math.max(100, initialProduct.height || 1800)));
      setWidth(Math.min(1200, Math.max(100, initialProduct.width || 600)));
      setDepth(Math.min(600, Math.max(100, initialProduct.depth || 150)));
      if (initialProduct.flute?.includes('5mm') || initialProduct.flute?.includes('5090')) {
        setFluteHeight('5 mm');
        setAngle('60° × 30°');
        setComparisonModel('5090');
      } else {
        setFluteHeight('7 mm');
        setAngle('45° × 45°');
        setComparisonModel('7090');
      }
      if (initialProduct.name?.includes('Black-Edge')) {
        setFinish('Carbon Coated');
      } else {
        setFinish('Virgin Kraft');
      }
    }
  }, [initialProduct]);

  const basePrice = 2050;
  const baselineVolume = 1800 * 600 * 150;

  const angleDelta = angle === '60° × 30°' ? 80 : 0;
  const fluteHeightDelta = fluteHeight === '5 mm' ? 120 : 0;
  const finishDelta =
    FINISH_SWATCHES.find((s) => s.name === finish)?.delta || 0;

  const unitPrice = useMemo(() => {
    const currentVolume = height * width * depth;
    const volumeRatio = currentVolume / baselineVolume;
    const calculatedBase = Math.round(basePrice * (0.45 + 0.55 * volumeRatio));
    return calculatedBase + angleDelta + fluteHeightDelta + finishDelta;
  }, [height, width, depth, angleDelta, fluteHeightDelta, finishDelta, baselineVolume]);

  const totalPrice = unitPrice * qty;
  const originalUnitPrice = Math.round(unitPrice * 1.18);
  const originalTotalPrice = originalUnitPrice * qty;

  const handleThumbClick = (item: typeof GALLERY_ITEMS[0], idx: number) => {
    setActiveThumbIndex(item.index);
    setImgFading(true);
    setTimeout(() => {
      // Use altSrc on first thumb click if clicked explicitly, matching HTML behavior
      setActiveImageSrc(idx === 0 && item.altSrc ? item.altSrc : item.mainSrc);
      setImgFading(false);
    }, 150);
  };

  const triggerSlideToast = (message: string) => {
    setSlideToast({
      visible: true,
      title: message,
      subtitle: `${qty} × ${height}×${width}×${depth}mm • ₹${totalPrice.toLocaleString('en-IN')}`,
    });
    setTimeout(() => {
      setSlideToast((prev) => ({ ...prev, visible: false }));
    }, 3800);
  };

  const buildConfiguredProduct = (): Product => ({
    id: `custom-${height}-${width}-${depth}-${fluteHeight}-${angle}-${finish}`,
    name: `CelPad™ (${height}×${width}×${depth} mm)`,
    dimensions: `${height} × ${width} × ${depth} mm`,
    height,
    width,
    depth,
    price: unitPrice,
    image: activeImageSrc,
    flute: `${fluteHeight} (${angle})`,
    efficiency: fluteHeight === '5 mm' ? '95%' : '92%',
  });

  const handleAddToCartClick = () => {
    const prod = buildConfiguredProduct();
    onAddToCart(prod, qty, `${finish} | ${fluteHeight} | ${angle}`);
    triggerSlideToast(`CelPad™ (${qty} pcs) added to cart`);
  };

  const handleBuyNowClick = () => {
    const prod = buildConfiguredProduct();
    onAddToCart(prod, qty, `${finish} | ${fluteHeight} | ${angle}`);
    onShowToast(
      `Proceeding to Payment: CelPad™ (${height}×${width}×${depth} mm)`,
      'shopping_cart_checkout'
    );
    onProceedToCheckout();
  };

  const activeBadgeLabel =
    GALLERY_ITEMS.find((g) => g.index === activeThumbIndex)?.label ||
    'Virgin Kraft 100g';

  const whatsappUrl = useMemo(() => {
    const msg = encodeURIComponent(
      `Hello MAXIMAIR Team,\nI want to inquire about a custom CelPad configuration:\n` +
        `- Dimensions: ${height} × ${width} × ${depth} mm\n` +
        `- Flute Angle: ${angle}\n` +
        `- Flute Height: ${fluteHeight}\n` +
        `- Coating Finish: ${finish}\n` +
        `- Quantity: ${qty} pcs\n` +
        `- Estimated Total: ₹${totalPrice.toLocaleString('en-IN')}`
    );
    return `https://wa.me/919825141727?text=${msg}`;
  }, [height, width, depth, angle, fluteHeight, finish, qty, totalPrice]);

  return (
    <div className="flex flex-col w-full pt-20 bg-[#fbf9f6] min-h-[calc(100vh-280px)]">
      {/* Universal Breadcrumbs & Category Bar - Exact continuation from Products */}
      <section className="w-full bg-[#f5f3f0]/60 pt-6 pb-10 border-b border-[#eae8e5]/60">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#414845] uppercase tracking-wider mb-1">
                <button
                  onClick={onNavigateHome}
                  className="hover:text-[#006c4f] transition-colors cursor-pointer bg-transparent border-0 p-0 uppercase font-semibold"
                >
                  Home
                </button>
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
                <button
                  onClick={onNavigateProducts}
                  className="hover:text-[#006c4f] transition-colors cursor-pointer bg-transparent border-0 p-0 uppercase font-semibold"
                >
                  Products
                </button>
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
                <span className="text-[#006c4f] font-bold">Custom</span>
              </div>
              <h1 className="text-[28px] md:text-[36px] leading-tight text-[#00231b] tracking-tight font-bold">
                CelPad Cellulose Matrix Systems
              </h1>
            </div>

            <div className="flex items-center gap-4 text-[#414845] flex-wrap">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#59fdc5] animate-pulse" />
                <span className="text-xs font-semibold text-[#00231b]">
                  Warehouse Dispatch Active
                </span>
              </div>
              <span className="text-xs font-semibold text-[#414845]/80">
                ISO 9001:2015 Bio-Matrix
              </span>
            </div>
          </div>

          {/* Quick Category Pills with Custom Cut-to-Size active */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={onNavigateProducts}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap bg-white text-[#414845] hover:text-[#00231b] cursor-pointer"
            >
              <span>All Media</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#e4e2df] text-[#00231b] text-[10px] font-bold">
                12
              </span>
            </button>

            <button
              onClick={onNavigateProducts}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap bg-white text-[#414845] hover:text-[#00231b] cursor-pointer"
            >
              <span>Standard Flute 7090</span>
            </button>

            <button
              onClick={onNavigateProducts}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap bg-white text-[#414845] hover:text-[#00231b] cursor-pointer"
            >
              <span>High Density 5090</span>
            </button>

            <button
              onClick={onNavigateProducts}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap bg-white text-[#414845] hover:text-[#00231b] cursor-pointer"
            >
              <span>Black-Edge™ Armor Coated</span>
            </button>

            <button
              className="px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap bg-[#00231b] text-white cursor-default"
            >
              <span className="material-symbols-outlined text-[16px] text-[#59fdc5]">
                tune
              </span>
              <span>Custom Cut-to-Size</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Custom Pad Showcase & Configurator */}
      <div className="max-w-[1360px] w-full mx-auto px-6 md:px-10 lg:px-16 pt-8 pb-16">
        {/* 1. TOP PRODUCT SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Visual Gallery (Hero Image + Thumbnails) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm aspect-square md:aspect-[4/3] flex items-center justify-center group border border-[#eae8e5]/60">
              <img
                alt="CelPad Evaporative Cooling Pad"
                src={activeImageSrc}
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, ASSETS.detailMain)}
                style={{ opacity: imgFading ? 0.4 : 1 }}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-[#00231b] shadow-sm border border-[#e4e2df]/80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#006c4f]" />
                <span>{activeBadgeLabel}</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 pointer-events-none">
                <span className="material-symbols-outlined text-[14px]">
                  photo_camera
                </span>
                <span>{activeThumbIndex} / 4</span>
              </div>
            </div>

            {/* Interactive Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {GALLERY_ITEMS.map((item, idx) => {
                const isSelected = activeThumbIndex === item.index;
                return (
                  <button
                    key={item.index}
                    type="button"
                    onClick={() => handleThumbClick(item, idx)}
                    className={`rounded-xl overflow-hidden aspect-video bg-white shadow-sm transition-all focus:outline-none relative group cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#00231b] opacity-100'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      alt={item.alt}
                      src={item.thumbSrc}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, ASSETS.product1800)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-[#00231b]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Configurator & Purchase */}
          <div className="lg:col-span-5 flex flex-col gap-6 bg-white p-6 sm:p-7 rounded-3xl border border-[#eae8e5]/60 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#00231b]">
                  CelPad
                </h1>
                <div className="flex items-center gap-1 bg-[#efeeeb] px-2.5 py-1 rounded-full text-xs font-semibold border border-[#e4e2df]">
                  <span
                    className="material-symbols-outlined text-[15px] text-amber-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>4.9</span>
                  <span className="text-[#717975] text-[11px]">(128)</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#00231b]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm line-through text-[#717975] font-medium">
                  ₹{originalTotalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#006c4f] bg-[#59fdc5]/30 px-2.5 py-0.5 rounded-full border border-[#59fdc5]/40">
                  In Stock
                </span>
              </div>

              <p className="text-xs text-[#414845] mt-1.5 font-medium">
                {height} × {width} × {depth} mm | {angle} | {fluteHeight} |{' '}
                {finish}
              </p>
            </div>

            {/* Precision Range Sliders & Interactive Selectors */}
            <div className="space-y-4 pt-1">
              {/* 1. Height Precision Slider (100 to 2000, step 10) */}
              <div className="bg-[#f5f3f0]/70 p-3.5 rounded-2xl border border-[#eae8e5]/60">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#00231b]">
                      height
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#717975]">
                      Height
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#00231b] bg-white px-2.5 py-0.5 rounded-md border border-[#eae8e5] shadow-xs">
                    {height} mm
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={10}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full precision-slider"
                />
                <div className="flex justify-between text-[10px] font-semibold text-[#717975] mt-1 px-0.5">
                  <span>100 mm</span>
                  <span>2000 mm</span>
                </div>
              </div>

              {/* 2. Width Precision Slider (100 to 1200, step 10) */}
              <div className="bg-[#f5f3f0]/70 p-3.5 rounded-2xl border border-[#eae8e5]/60">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#00231b]">
                      straighten
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#717975]">
                      Width
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#00231b] bg-white px-2.5 py-0.5 rounded-md border border-[#eae8e5] shadow-xs">
                    {width} mm
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1200}
                  step={10}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full precision-slider"
                />
                <div className="flex justify-between text-[10px] font-semibold text-[#717975] mt-1 px-0.5">
                  <span>100 mm</span>
                  <span>1200 mm</span>
                </div>
              </div>

              {/* 3. Thickness (Depth) Precision Slider (100 to 600, step 10) */}
              <div className="bg-[#f5f3f0]/70 p-3.5 rounded-2xl border border-[#eae8e5]/60">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#00231b]">
                      view_in_ar
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#717975]">
                      Thickness (Depth)
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#00231b] bg-white px-2.5 py-0.5 rounded-md border border-[#eae8e5] shadow-xs">
                    {depth} mm
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={600}
                  step={10}
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="w-full precision-slider"
                />
                <div className="flex justify-between text-[10px] font-semibold text-[#717975] mt-1 px-0.5">
                  <span>100 mm</span>
                  <span>600 mm</span>
                </div>
              </div>

              {/* Flute Angle & Flute Height Controls */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Flute Angle */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#717975]">
                      Flute Angle
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['45° × 45°', '60° × 30°'] as const).map((itemAngle) => (
                      <button
                        key={itemAngle}
                        type="button"
                        onClick={() => setAngle(itemAngle)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-colors cursor-pointer ${
                          angle === itemAngle
                            ? 'bg-[#00231b] text-white shadow-sm'
                            : 'bg-[#efeeeb] text-[#1b1c1a] hover:bg-[#eae8e5]'
                        }`}
                      >
                        {itemAngle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flute Height Selector (5mm / 7mm) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#717975]">
                      Flute Height
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['5 mm', '7 mm'] as const).map((fHeight) => (
                      <button
                        key={fHeight}
                        type="button"
                        onClick={() => {
                          setFluteHeight(fHeight);
                          setComparisonModel(fHeight === '5 mm' ? '5090' : '7090');
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-colors cursor-pointer ${
                          fluteHeight === fHeight
                            ? 'bg-[#00231b] text-white shadow-sm'
                            : 'bg-[#efeeeb] text-[#1b1c1a] hover:bg-[#eae8e5]'
                        }`}
                      >
                        {fHeight}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coating Swatches */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#717975]">
                    Coating Finish
                  </span>
                  <span className="text-xs font-semibold text-[#00231b]">
                    {finish}
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  {FINISH_SWATCHES.map((swatch) => {
                    const isSelected = finish === swatch.name;
                    return (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => setFinish(swatch.name)}
                        title={swatch.name}
                        style={{ backgroundColor: swatch.color }}
                        className={`w-7 h-7 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-[#00231b] ring-offset-2 scale-110'
                            : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quantity & Purchase Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-[#efeeeb] rounded-xl p-1 border border-[#eae8e5]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#1b1c1a] hover:bg-[#e4e2df] transition-colors select-none active:scale-95 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    readOnly
                    value={qty}
                    className="w-12 text-center bg-transparent font-bold text-[#00231b] focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty(Math.min(99, qty + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#1b1c1a] hover:bg-[#e4e2df] transition-colors select-none active:scale-95 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* CTA Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#00231b] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0e3a2f] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    shopping_bag
                  </span>
                  <span>Add to Cart</span>
                </button>

                {/* WhatsApp Quick Action */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp Order Inquiry"
                  className="w-12 h-12 rounded-xl bg-[#efeeeb] flex items-center justify-center text-[#00231b] hover:bg-[#59fdc5]/40 transition-colors border border-[#eae8e5]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    chat
                  </span>
                </a>
              </div>

              {/* Direct Buy Now */}
              <button
                type="button"
                onClick={handleBuyNowClick}
                className="w-full py-3.5 px-5 rounded-xl bg-[#59fdc5] text-[#002116] text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-[#2fe0aa] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <span>Buy Now</span>
                <span className="material-symbols-outlined text-[17px]">
                  arrow_forward
                </span>
              </button>
            </div>

            {/* Micro Trust Bar */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#717975] border-t border-[#eae8e5] pt-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006c4f]">
                  verified
                </span>
                ISO 9001:2008
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006c4f]">
                  local_shipping
                </span>
                Pan-India
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006c4f]">
                  shield
                </span>
                5+ Yr Lifespan
              </span>
            </div>
          </div>
        </div>

        {/* 2. VISUAL SPEC TILES */}
        <section className="mt-16 sm:mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#eae8e5]/60">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#efeeeb] flex items-center justify-center text-[#00231b] mb-3">
                <span className="material-symbols-outlined text-[20px]">
                  water_drop
                </span>
              </div>
              <div className="text-3xl font-extrabold text-[#00231b] tracking-tight">
                {fluteHeight === '5 mm' ? '95%' : '92%'}
              </div>
              <div className="text-xs uppercase font-bold tracking-wider text-[#717975] mt-1">
                Saturation Efficiency
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#eae8e5]/60">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#59fdc5]/40 flex items-center justify-center text-[#006c4f] mb-3">
                <span className="material-symbols-outlined text-[20px]">air</span>
              </div>
              <div className="text-3xl font-extrabold text-[#006c4f] tracking-tight">
                {fluteHeight === '5 mm' ? '1.5 m/s' : '2.0 m/s'}
              </div>
              <div className="text-xs uppercase font-bold tracking-wider text-[#717975] mt-1">
                Optimal Airflow
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#eae8e5]/60">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#efeeeb] flex items-center justify-center text-[#00231b] mb-3">
                <span className="material-symbols-outlined text-[20px]">
                  compress
                </span>
              </div>
              <div className="text-3xl font-extrabold text-[#00231b] tracking-tight">
                &lt;35 Pa
              </div>
              <div className="text-xs uppercase font-bold tracking-wider text-[#717975] mt-1">
                Pressure Resistance
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#eae8e5]/60">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#efeeeb] flex items-center justify-center text-[#006c4f] mb-3">
                <span className="material-symbols-outlined text-[20px]">
                  layers
                </span>
              </div>
              <div className="text-3xl font-extrabold text-[#00231b] tracking-tight">
                105 g/m²
              </div>
              <div className="text-xs uppercase font-bold tracking-wider text-[#717975] mt-1">
                Paper Density
              </div>
            </div>
          </div>
        </section>

        {/* 3. STREAMLINED COMPARISON & TECHNICAL TABS */}
        <section className="mt-12 sm:mt-16">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#eae8e5]/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#717975] block">
                  Technical Specifications
                </span>
                <h2 className="text-base font-bold text-[#00231b] mt-0.5">
                  CelPad™ Model Matrix Comparison
                </h2>
              </div>

              {/* Interactive Model Toggle Switch */}
              <div
                className="inline-flex p-1 rounded-xl bg-[#efeeeb] border border-[#eae8e5]"
                role="tablist"
              >
                <button
                  type="button"
                  onClick={() => {
                    setComparisonModel('7090');
                    setFluteHeight('7 mm');
                    setAngle('45° × 45°');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    comparisonModel === '7090'
                      ? 'bg-[#00231b] text-white shadow-sm'
                      : 'text-[#414845] hover:text-[#00231b]'
                  }`}
                >
                  CelPad™ 7090 {comparisonModel === '7090' ? '(Selected)' : ''}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComparisonModel('5090');
                    setFluteHeight('5 mm');
                    setAngle('60° × 30°');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    comparisonModel === '5090'
                      ? 'bg-[#00231b] text-white shadow-sm'
                      : 'text-[#414845] hover:text-[#00231b]'
                  }`}
                >
                  CelPad™ 5090 {comparisonModel === '5090' ? '(Selected)' : ''}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[#e4e2df] text-xs uppercase font-bold text-[#717975]">
              <div>Metric</div>
              <div
                className={`py-1 px-2 rounded-md ${
                  comparisonModel === '7090'
                    ? 'text-[#00231b] font-extrabold bg-[#efeeeb]/60'
                    : ''
                }`}
              >
                7090 (Standard)
              </div>
              <div
                className={`py-1 px-2 rounded-md ${
                  comparisonModel === '5090'
                    ? 'text-[#00231b] font-extrabold bg-[#efeeeb]/60'
                    : ''
                }`}
              >
                5090 (High Dense)
              </div>
            </div>

            <div className="space-y-4 pt-4 text-sm font-semibold divide-y divide-[#eae8e5]/40">
              <div className="grid grid-cols-3 gap-4 items-center pt-2">
                <span className="text-[#414845] font-medium text-xs">
                  Flute Height
                </span>
                <span
                  className={`py-1 px-2 rounded-md ${
                    comparisonModel === '7090'
                      ? 'text-[#00231b] font-bold bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  7.0 mm
                </span>
                <span
                  className={`py-1 px-2 rounded-md ${
                    comparisonModel === '5090'
                      ? 'text-[#00231b] font-bold bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  5.0 mm
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center pt-3">
                <span className="text-[#414845] font-medium text-xs">
                  Recommended Face Velocity
                </span>
                <span
                  className={`py-1 px-2 rounded-md ${
                    comparisonModel === '7090'
                      ? 'text-[#006c4f] font-bold bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  1.5 – 2.0 m/s
                </span>
                <span
                  className={`py-1 px-2 rounded-md ${
                    comparisonModel === '5090'
                      ? 'text-[#006c4f] font-bold bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  1.0 – 1.5 m/s
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center pt-3">
                <span className="text-[#414845] font-medium text-xs">
                  Typical Pressure Drop
                </span>
                <span
                  className={`py-1 px-2 rounded-md ${
                    comparisonModel === '7090'
                      ? 'text-[#00231b] font-bold bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  25 Pa (Low Resistance)
                </span>
                <span
                  className={`py-1 px-2 rounded-md ${
                    comparisonModel === '5090'
                      ? 'text-[#00231b] font-bold bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  42 Pa
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center pt-3">
                <span className="text-[#414845] font-medium text-xs">
                  Primary Use Cases
                </span>
                <span
                  className={`font-medium text-xs py-1 px-2 rounded-md ${
                    comparisonModel === '7090'
                      ? 'text-[#00231b] bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  Greenhouses, Poultry, Commercial AHU
                </span>
                <span
                  className={`font-medium text-xs py-1 px-2 rounded-md ${
                    comparisonModel === '5090'
                      ? 'text-[#00231b] bg-[#efeeeb]/50'
                      : 'text-[#717975]'
                  }`}
                >
                  Gas Turbines, High Humidity Pre-coolers
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modern Slide Confirmation Toast */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-[#0e3a2f] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 transition-all duration-300 border border-emerald-500/30 ${
          slideToast.visible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-28 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-[#59fdc5] flex items-center justify-center text-[#00231b]">
          <span className="material-symbols-outlined text-[19px]">check</span>
        </div>
        <div>
          <div className="text-xs font-bold text-white">{slideToast.title}</div>
          <div className="text-[11px] text-emerald-200">
            {slideToast.subtitle}
          </div>
        </div>
        <button
          onClick={onOpenCart}
          className="ml-2 text-xs font-bold text-[#59fdc5] underline hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          View Cart
        </button>
      </div>
    </div>
  );
};
