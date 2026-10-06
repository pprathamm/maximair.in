import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ThermodynamicMatrix } from './components/ThermodynamicMatrix';
import { ApplicationsGallery } from './components/ApplicationsGallery';
import { ReadyToShipProducts } from './components/ReadyToShipProducts';
import { SpecificationsTable } from './components/SpecificationsTable';
import { Calculator } from './components/Calculator';
import { ProductsCatalogueView } from './components/ProductsCatalogueView';
import { ProductDetailView } from './components/ProductDetailView';
import { PaymentCheckoutView } from './components/PaymentCheckoutView';
import { CustomSizeModal, CustomInquiryData } from './components/CustomSizeModal';
import { CartDrawer } from './components/CartDrawer';
import { FeatureModal } from './components/FeatureModal';
import { Footer } from './components/Footer';
import { ToastContainer, ToastItem } from './components/Toast';
import { STANDARD_PRODUCTS } from './data/mockData';
import { Product, CartItem, FeatureDetail } from './types';

export default function App() {
  // Navigation View: 'landing' | 'catalog' | 'product' | 'checkout'
  const [activeView, setActiveView] = useState<
    'landing' | 'catalog' | 'product' | 'checkout'
  >('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product>({
    ...STANDARD_PRODUCTS[0],
    height: 1800,
    width: 600,
    depth: 150,
    price: 2050,
  });

  // Modals & Drawers state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [customInitialHeight, setCustomInitialHeight] = useState<number>(1800);
  const [customInitialDepth, setCustomInitialDepth] = useState<string>('100 mm');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeFeature, setActiveFeature] = useState<FeatureDetail | null>(null);

  // Cart state - initialized with 1 item as shown in the screenshot badge "1"
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'initial-cart-item-1',
      product: STANDARD_PRODUCTS[0], // 1800 x 600 x 100 mm
      quantity: 1,
      edgeCoating: 'Standard Raw Kraft',
      unitPrice: 1480,
    },
  ]);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, icon = 'check_circle') => {
    const newToast: ToastItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      icon,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, edgeCoating: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.dimensions === product.dimensions &&
          item.edgeCoating === edgeCoating
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            product,
            quantity,
            edgeCoating,
            unitPrice: product.price,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart', 'delete');
  };

  const handleQuickAddDefault = () => {
    handleAddToCart(STANDARD_PRODUCTS[0], 1, 'Standard Raw Kraft');
    showToast('Added 1800 × 600 Standard Unit to Cart', 'add_shopping_cart');
  };

  // Navigation handlers
  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCustomSizer = () => {
    setSelectedProduct({
      id: 'custom-default-1800-600-150',
      name: 'CelPad™ (1800×600×150 mm)',
      dimensions: '1800 × 600 × 150 mm',
      height: 1800,
      width: 600,
      depth: 150,
      price: 2050,
      image: '',
      flute: '7 mm (45° × 45°)',
      efficiency: '92%',
    });
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateProductsCatalog = () => {
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCheckout = () => {
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplorePads = () => {
    if (activeView !== 'landing') {
      setActiveView('landing');
    }
    setTimeout(() => {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleOpenCustomModal = (height = 1800, depth = '100 mm') => {
    setCustomInitialHeight(height);
    setCustomInitialDepth(depth);
    setIsCustomModalOpen(true);
  };

  // Custom Inquiry Submission
  const handleCustomInquirySubmit = (data: CustomInquiryData) => {
    setIsCustomModalOpen(false);
    showToast(
      `Custom inquiry for ${data.quantity} units (${data.height}×${data.width}×${data.depth}) submitted!`,
      'mark_email_read'
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans antialiased relative flex flex-col justify-between">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Fixed Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenInquire={() => handleOpenCustomModal()}
        onNavigateHome={handleNavigateHome}
        onNavigateProducts={handleNavigateProductsCatalog}
        onNavigateCustomSizer={handleNavigateCustomSizer}
        activeView={activeView}
      />

      {/* Main View Transition */}
      {activeView === 'landing' && (
        <main className="w-full pt-20">
          {/* 1. Hero Section */}
          <Hero onExplorePads={handleExplorePads} />

          {/* 2. Ready-to-Ship Standard Sizes (Products) */}
          <ReadyToShipProducts
            onOpenProductDetail={handleOpenProductDetail}
            onBrowseMoreProducts={handleNavigateProductsCatalog}
            onOpenCustomInquiry={handleNavigateCustomSizer}
            onQuickAddToCart={(prod, e) => {
              e.stopPropagation();
              handleAddToCart(prod, 1, 'Standard Raw Kraft');
              showToast(`Added ${prod.dimensions} to Cart`);
            }}
          />

          {/* 3. Applications Carousel */}
          <ApplicationsGallery />

          {/* 4. Interactive Psychrometric Estimator (Cooling and Water Estimator) */}
          <Calculator />

          {/* 5. Thermodynamic Matrix Section (Cross-Corrugated Geometry) */}
          <ThermodynamicMatrix onSelectFeature={(feat) => setActiveFeature(feat)} />

          {/* 6. Specifications Table */}
          <SpecificationsTable />
        </main>
      )}

      {activeView === 'catalog' && (
        <ProductsCatalogueView
          onNavigateHome={handleNavigateHome}
          onAddToCart={handleAddToCart}
          onConfigureProduct={handleOpenProductDetail}
          onOpenCustomModal={handleOpenCustomModal}
          onShowToast={showToast}
        />
      )}

      {activeView === 'product' && (
        <ProductDetailView
          initialProduct={selectedProduct}
          onNavigateHome={handleNavigateHome}
          onNavigateProducts={handleNavigateProductsCatalog}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onProceedToCheckout={handleNavigateCheckout}
          onShowToast={showToast}
        />
      )}

      {activeView === 'checkout' && (
        <PaymentCheckoutView
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onBackToProducts={handleNavigateProductsCatalog}
          onBackToStore={handleNavigateHome}
          onShowToast={showToast}
        />
      )}

      {/* Footer */}
      <Footer
        onOpenInquire={() => handleOpenCustomModal()}
        onNavigateHome={handleNavigateHome}
        onNavigateProducts={handleNavigateProductsCatalog}
        onNavigateCustomSizer={handleNavigateCustomSizer}
      />

      {/* Custom Size Inquiry Modal */}
      <CustomSizeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomInquirySubmit}
        initialHeight={customInitialHeight}
        initialDepth={customInitialDepth}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onQuickAddDefault={handleQuickAddDefault}
        onProceedToCheckout={handleNavigateCheckout}
        onShowToast={showToast}
      />

      {/* Feature Deep Dive Modal */}
      <FeatureModal
        feature={activeFeature}
        onClose={() => setActiveFeature(null)}
        onInquire={() => handleOpenCustomModal()}
      />
    </div>
  );
}
