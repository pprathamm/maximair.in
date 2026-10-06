import React, { useState, useMemo } from 'react';
import { CATALOG_PRODUCTS, ASSETS } from '../data/mockData';
import { CatalogProduct, Product } from '../types';
import { handleImageError } from '../utils/imageUtils';

interface ProductsCatalogueViewProps {
  onNavigateHome: () => void;
  onAddToCart: (product: Product, quantity: number, edgeCoating: string) => void;
  onConfigureProduct: (product: Product) => void;
  onOpenCustomModal: (initialHeight?: number, initialDepth?: string) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const ProductsCatalogueView: React.FC<ProductsCatalogueViewProps> = ({
  onNavigateHome,
  onAddToCart,
  onConfigureProduct,
  onOpenCustomModal,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHeight, setSelectedHeight] = useState<string>('h-all');
  const [selectedDepth, setSelectedDepth] = useState<string>('d-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Custom Card interactive state
  const [customHeight, setCustomHeight] = useState<number>(1650);
  const [customDepth, setCustomDepth] = useState<number>(150);

  const customEstimate = useMemo(() => {
    const baseArea = (customHeight / 1000) * 0.6;
    const depthMultiplier = customDepth === 100 ? 1.0 : customDepth === 150 ? 1.35 : 1.75;
    return Math.round(baseArea * depthMultiplier * 1620);
  }, [customHeight, customDepth]);

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((item) => {
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesHeight =
        selectedHeight === 'h-all' || String(item.height) === selectedHeight;
      const matchesDepth =
        selectedDepth === 'd-all' || String(item.depth) === selectedDepth;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.fluteTag.toLowerCase().includes(q);

      return matchesCat && matchesHeight && matchesDepth && matchesSearch;
    });
  }, [selectedCategory, selectedHeight, selectedDepth, searchQuery]);

  // Determine whether the custom builder card is visible under current filters
  const showCustomCard = useMemo(() => {
    const matchesCat =
      selectedCategory === 'all' || selectedCategory === 'custom';
    const matchesHeight =
      selectedHeight === 'h-all' ||
      ['1200', '1500', '1800', '2000'].includes(selectedHeight);
    const matchesDepth =
      selectedDepth === 'd-all' || ['100', '150'].includes(selectedDepth);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      'celpad custom dimensions made to order precision cut'.includes(q);

    return matchesCat && matchesHeight && matchesDepth && matchesSearch;
  }, [selectedCategory, selectedHeight, selectedDepth, searchQuery]);

  const totalVisibleCount = filteredProducts.length + (showCustomCard ? 1 : 0);

  const convertToStandardProduct = (catItem: CatalogProduct): Product => ({
    id: catItem.id,
    name: `${catItem.title} (${catItem.height}×${catItem.width}×${catItem.depth})`,
    dimensions: `${catItem.height} × ${catItem.width} × ${catItem.depth} mm`,
    height: catItem.height,
    width: catItem.width,
    depth: catItem.depth,
    price: catItem.price,
    image: catItem.image,
    flute: catItem.fluteTag,
    efficiency: catItem.badgePrimary,
  });

  const handleCardAddToCart = (catItem: CatalogProduct) => {
    const prod = convertToStandardProduct(catItem);
    const coating =
      catItem.category === 'black-edge'
        ? 'Black-Edge™ Anti-Algae'
        : 'Standard Raw Kraft';
    onAddToCart(prod, 1, coating);
    onShowToast(
      `${catItem.title} (${catItem.height}x${catItem.width}x${catItem.depth}) queued for dispatch.`,
      'check_circle'
    );
  };

  const handleCardConfigure = (catItem: CatalogProduct) => {
    const prod = convertToStandardProduct(catItem);
    onConfigureProduct(prod);
  };

  return (
    <div className="flex flex-col w-full pt-20 bg-[#fbf9f6] min-h-[calc(100vh-280px)]">
      {/* Breadcrumbs & Category Bar */}
      <section className="w-full bg-[#f5f3f0]/60 pt-6 pb-10">
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
                <span className="text-[#006c4f] font-bold">Products</span>
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

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#00231b] text-white'
                  : 'bg-white text-[#414845] hover:text-[#00231b]'
              }`}
            >
              <span>All Media</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#e4e2df] text-[#00231b] text-[10px] font-bold">
                12
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('7090')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                selectedCategory === '7090'
                  ? 'bg-[#00231b] text-white font-bold'
                  : 'bg-white text-[#414845] hover:text-[#00231b]'
              }`}
            >
              <span>Standard Flute 7090</span>
            </button>

            <button
              onClick={() => setSelectedCategory('5090')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                selectedCategory === '5090'
                  ? 'bg-[#00231b] text-white font-bold'
                  : 'bg-white text-[#414845] hover:text-[#00231b]'
              }`}
            >
              <span>High Density 5090</span>
            </button>

            <button
              onClick={() => setSelectedCategory('black-edge')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                selectedCategory === 'black-edge'
                  ? 'bg-[#00231b] text-white font-bold'
                  : 'bg-white text-[#414845] hover:text-[#00231b]'
              }`}
            >
              <span>Black-Edge™ Armor Coated</span>
            </button>

            <button
              onClick={() => setSelectedCategory('custom')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                selectedCategory === 'custom'
                  ? 'bg-[#00231b] text-white font-bold'
                  : 'bg-white text-[#414845] hover:text-[#00231b]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#006c4f]">
                tune
              </span>
              <span>Custom Cut-to-Size</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter & Interactive Precision Toolstrip */}
      <section className="w-full bg-[#fbf9f6] py-4">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border border-[#eae8e5]/60">
            {/* Search & Height/Depth Filters */}
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Search input */}
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#414845] text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search flute, dimension, SKU..."
                  className="w-full bg-[#f5f3f0] pl-10 pr-4 py-2 rounded-lg text-sm text-[#1b1c1a] placeholder:text-[#414845]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006c4f] transition-all"
                />
              </div>

              {/* Height Filter Group */}
              <div className="flex items-center gap-1 bg-[#f5f3f0] p-1 rounded-lg overflow-x-auto">
                <span className="text-[11px] text-[#414845] px-2 uppercase font-bold">
                  Height
                </span>
                {[
                  { id: 'h-all', label: 'All' },
                  { id: '1200', label: '1200mm' },
                  { id: '1500', label: '1500mm' },
                  { id: '1800', label: '1800mm' },
                  { id: '2000', label: '2000mm' },
                ].map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHeight(h.id)}
                    className={`px-2.5 py-1 text-xs rounded transition-all cursor-pointer ${
                      selectedHeight === h.id
                        ? 'font-bold bg-[#00231b] text-white'
                        : 'font-semibold text-[#414845] hover:text-[#00231b]'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>

              {/* Depth Filter Group */}
              <div className="flex items-center gap-1 bg-[#f5f3f0] p-1 rounded-lg">
                <span className="text-[11px] text-[#414845] px-2 uppercase font-bold">
                  Depth
                </span>
                {[
                  { id: 'd-all', label: 'All' },
                  { id: '100', label: '100mm' },
                  { id: '150', label: '150mm' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDepth(d.id)}
                    className={`px-2.5 py-1 text-xs rounded transition-all cursor-pointer ${
                      selectedDepth === d.id
                        ? 'font-bold bg-[#00231b] text-white'
                        : 'font-semibold text-[#414845] hover:text-[#00231b]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Summary & View Switcher */}
            <div className="flex items-center justify-between lg:justify-end gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#414845]">
                <span>Showing:</span>
                <span className="font-bold text-[#00231b]">
                  {totalVisibleCount} Configured Model{totalVisibleCount === 1 ? '' : 's'}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#f5f3f0] p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#00231b] shadow-sm'
                      : 'text-[#414845] hover:text-[#00231b]'
                  }`}
                  title="Grid Layout"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    grid_view
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-[#00231b] shadow-sm'
                      : 'text-[#414845] hover:text-[#00231b]'
                  }`}
                  title="Table Matrix Layout"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    view_agenda
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalogue Grid */}
      <section className="w-full py-10">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-16">
          {totalVisibleCount === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#eae8e5] space-y-4">
              <span className="material-symbols-outlined text-4xl text-[#717975]">
                filter_alt_off
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#00231b]">
                  No matching standard configurations found
                </h3>
                <p className="text-xs text-[#717975] mt-1">
                  Reset your filters or configure a bespoke CNC cut dimension below.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedHeight('h-all');
                    setSelectedDepth('d-all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#00231b] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => onOpenCustomModal()}
                  className="px-4 py-2 rounded-lg bg-[#59fdc5] text-[#002116] text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Custom Size Quote
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className={`group flex ${
                    viewMode === 'list'
                      ? 'flex-col md:flex-row items-stretch'
                      : 'flex-col'
                  } bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#eae8e5]/60`}
                >
                  <div
                    className={`relative ${
                      viewMode === 'list'
                        ? 'md:w-80 aspect-[4/3] md:aspect-auto'
                        : 'aspect-[4/3]'
                    } bg-[#eae8e5] overflow-hidden shrink-0 cursor-pointer`}
                    onClick={() => handleCardConfigure(item)}
                  >
                    <img
                      alt={item.title}
                      src={item.image}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, ASSETS.product1800)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${item.badgePrimaryClass}`}
                      >
                        {item.badgePrimary}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${item.badgeSecondaryClass}`}
                      >
                        {item.badgeSecondary}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-bold text-[#00231b] shadow-sm">
                      {item.fluteTag}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h2
                          onClick={() => handleCardConfigure(item)}
                          className="text-lg text-[#00231b] font-bold hover:text-[#006c4f] transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h2>
                        <span className="text-[11px] text-[#006c4f] font-bold whitespace-nowrap bg-[#006c4f]/10 px-2 py-0.5 rounded">
                          In Stock
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#414845] mb-4">
                        {item.subtitle}
                      </p>

                      {/* Mini Spec Pills */}
                      <div className="grid grid-cols-3 gap-2 bg-[#f5f3f0] p-2.5 rounded-lg mb-6 text-center">
                        <div>
                          <span className="block text-[11px] font-bold text-[#414845] uppercase">
                            {item.specs.label1}
                          </span>
                          <span className="text-sm font-bold text-[#00231b]">
                            {item.specs.val1}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-[#414845] uppercase">
                            {item.specs.label2}
                          </span>
                          <span className="text-sm font-bold text-[#00231b]">
                            {item.specs.val2}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-[#414845] uppercase">
                            {item.specs.label3}
                          </span>
                          <span className="text-sm font-bold text-[#00231b]">
                            {item.specs.val3}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <span className="text-[11px] font-bold text-[#414845] uppercase">
                            Per Unit Price
                          </span>
                          <p className="text-2xl text-[#00231b] font-extrabold tracking-tight">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#414845]">
                          {item.priceNote}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCardAddToCart(item)}
                          className="flex-1 bg-[#59fdc5] hover:bg-[#2fe0aa] text-[#007354] text-[13px] font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            shopping_cart
                          </span>
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => handleCardConfigure(item)}
                          className="w-10 h-10 rounded-lg bg-[#efeeeb] hover:bg-[#eae8e5] flex items-center justify-center text-[#00231b] transition-colors cursor-pointer"
                          title="Configure Pad"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            tune
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Card 6: Custom Dimension Builder Card */}
              {showCustomCard && (
                <div className="flex flex-col bg-[#0e3a2f] text-white rounded-xl overflow-hidden shadow-md justify-between">
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#59fdc5] text-[#002116] text-[11px] font-bold">
                          Bespoke CNC Cut
                        </span>
                        <span className="material-symbols-outlined text-[#2fe0aa] text-[28px]">
                          precision_manufacturing
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold mb-1 text-white">
                        CelPad™ Custom Dimensions
                      </h2>
                      <p className="text-sm text-[#a4d0c0] mb-6">
                        Fabricated precisely to your plant casing within ±1mm tolerance. Fast 48h turnaround dispatch.
                      </p>

                      {/* Interactive Live Customizer Widget in Card */}
                      <div className="bg-[#00231b]/60 p-4 rounded-lg space-y-4 mb-6">
                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-[#a4d0c0] mb-1">
                            <span>
                              Height:{' '}
                              <strong className="text-white">
                                {customHeight} mm
                              </strong>
                            </span>
                            <span>Range 600 - 2400 mm</span>
                          </div>
                          <input
                            type="range"
                            min="600"
                            max="2400"
                            step="50"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Number(e.target.value))}
                            className="w-full accent-[#59fdc5] cursor-pointer h-1.5 bg-[#00231b] rounded-lg"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-[#a4d0c0] mb-1">
                            <span>
                              Depth:{' '}
                              <strong className="text-white">
                                {customDepth} mm
                              </strong>
                            </span>
                            <span>50 / 75 / 100 / 150 / 200 mm</span>
                          </div>
                          <div className="flex gap-2">
                            {[100, 150, 200].map((dVal) => (
                              <button
                                key={dVal}
                                type="button"
                                onClick={() => setCustomDepth(dVal)}
                                className={`flex-1 py-1 text-center text-[11px] rounded font-bold transition-all cursor-pointer ${
                                  customDepth === dVal
                                    ? 'bg-[#59fdc5] text-[#002116]'
                                    : 'bg-[#00231b] text-[#a4d0c0] hover:text-white'
                                }`}
                              >
                                {dVal}mm
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4 pt-1">
                        <div>
                          <span className="text-[11px] font-bold text-[#a4d0c0] uppercase">
                            Estimated Matrix Cost
                          </span>
                          <p className="text-2xl text-[#59fdc5] font-bold">
                            ₹{customEstimate.toLocaleString('en-IN')} / unit
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#7aa496]">
                          Min order 4 pcs
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          onConfigureProduct({
                            id: `custom-${customHeight}-600-${customDepth}`,
                            name: `CelPad™ Custom (${customHeight}×600×${customDepth} mm)`,
                            dimensions: `${customHeight} × 600 × ${customDepth} mm`,
                            height: customHeight,
                            width: 600,
                            depth: customDepth,
                            price: customEstimate,
                            image: '',
                            flute: '7090 (45°×45°)',
                            efficiency: '92%',
                          })
                        }
                        className="w-full bg-[#59fdc5] hover:bg-[#2fe0aa] text-[#002116] text-[13px] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <span>Configure Custom Pad</span>
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Technical Spec & Comparative Matrix Drawer Preview */}
      <section className="w-full bg-[#f5f3f0] py-16">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold text-[#006c4f] uppercase tracking-widest block mb-1">
                Engineering Benchmark
              </span>
              <h2 className="text-[28px] md:text-[36px] leading-tight text-[#00231b] font-bold">
                Flute Geometry &amp; Efficiency Matrix
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[#414845] text-xs font-semibold">
              <span className="material-symbols-outlined text-[#006c4f] text-[20px]">
                verified
              </span>
              <span>Tested under ASHRAE 143-2015 Standards</span>
            </div>
          </div>

          {/* Comparative Spec Table Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#eae8e5]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#efeeeb] text-xs font-semibold text-[#414845] uppercase tracking-wider">
                    <th className="p-6">Specification</th>
                    <th className="p-6 text-[#00231b] font-bold">
                      Standard CelPad™ 7090
                    </th>
                    <th className="p-6 text-[#00231b] font-bold">
                      Dense CelPad™ 5090
                    </th>
                    <th className="p-6 text-[#00231b] font-bold">
                      Armor Black-Edge™
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f3f0] text-sm">
                  <tr className="hover:bg-[#f5f3f0]/50 transition-colors">
                    <td className="p-6 font-semibold text-[#00231b]">
                      Flute Height &amp; Angles
                    </td>
                    <td className="p-6 text-[#1b1c1a]">7 mm (45° + 45°)</td>
                    <td className="p-6 text-[#1b1c1a]">5 mm (60° + 30°)</td>
                    <td className="p-6 text-[#1b1c1a]">
                      7 mm with Polymer edge
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f0]/50 transition-colors">
                    <td className="p-6 font-semibold text-[#00231b]">
                      Evaporative Saturation Efficiency
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#00231b]">
                          85% – 92%
                        </span>
                        <div className="w-24 bg-[#eae8e5] rounded-full h-2">
                          <div
                            className="bg-[#006c4f] h-2 rounded-full"
                            style={{ width: '88%' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#00231b]">
                          92% – 96%
                        </span>
                        <div className="w-24 bg-[#eae8e5] rounded-full h-2">
                          <div
                            className="bg-[#2fe0aa] h-2 rounded-full"
                            style={{ width: '95%' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#00231b]">
                          85% – 90%
                        </span>
                        <div className="w-24 bg-[#eae8e5] rounded-full h-2">
                          <div
                            className="bg-[#006c4f] h-2 rounded-full"
                            style={{ width: '87%' }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f0]/50 transition-colors">
                    <td className="p-6 font-semibold text-[#00231b]">
                      Optimum Face Velocity
                    </td>
                    <td className="p-6 text-[#1b1c1a]">1.2 – 1.8 m/s</td>
                    <td className="p-6 text-[#1b1c1a]">1.8 – 2.5 m/s</td>
                    <td className="p-6 text-[#1b1c1a]">1.2 – 1.8 m/s</td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f0]/50 transition-colors">
                    <td className="p-6 font-semibold text-[#00231b]">
                      Recommended Applications
                    </td>
                    <td className="p-6 text-[#414845]">
                      Greenhouses, Poultry, Heavy Mills
                    </td>
                    <td className="p-6 text-[#414845]">
                      Turbine Inlets, Data Centers, High CFM
                    </td>
                    <td className="p-6 text-[#414845]">
                      Direct Sun, Dusty / Algae prone climates
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f0]/50 transition-colors">
                    <td className="p-6 font-semibold text-[#00231b]">
                      Cleaning / Maintenance
                    </td>
                    <td className="p-6 text-[#414845]">
                      Periodic flush &amp; chemical descaling
                    </td>
                    <td className="p-6 text-[#414845]">
                      Clean supply water, bi-annual rinse
                    </td>
                    <td className="p-6 text-[#414845]">
                      Pressure washable, high friction tolerant
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Help Bar inside card */}
            <div className="bg-[#eae8e5]/60 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#414845] text-xs font-semibold">
                <span className="material-symbols-outlined text-[18px] text-[#006c4f]">
                  info
                </span>
                <span>
                  Need advice calculating static pressure drop or face area?
                </span>
              </div>
              <button
                onClick={() => onOpenCustomModal()}
                className="text-xs text-[#00231b] font-bold hover:text-[#006c4f] flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                <span>Speak with MAXIMAIR HVAC Engineer</span>
                <span className="material-symbols-outlined text-[16px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
