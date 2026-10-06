import React, { useState, useMemo } from 'react';
import { CartItem } from '../types';

interface PaymentCheckoutViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onBackToProducts: () => void;
  onBackToStore: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const PaymentCheckoutView: React.FC<PaymentCheckoutViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onBackToProducts,
  onBackToStore,
  onShowToast,
}) => {
  // Shipping Form State (pre-filled with defaults from HTML prototype)
  const [fullName, setFullName] = useState<string>('Rajesh Mehta');
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [emailAddress, setEmailAddress] = useState<string>('rajesh.mehta@enterprise.in');
  const [shippingAddress, setShippingAddress] = useState<string>(
    'Plot 48, GIDC Industrial Estate, Phase 2, Vatva'
  );
  const [city, setCity] = useState<string>('Ahmedabad');
  const [pinCode, setPinCode] = useState<string>('382445');
  const [stateName, setStateName] = useState<string>('Gujarat');

  // PIN verification state
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);
  const [pinVerifiedFreeShipping, setPinVerifiedFreeShipping] = useState<boolean>(false);

  // Payment method state
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'cod'>('upi');

  // Promo code state
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Fallback local item if cart is empty (matches HTML prototype CelPad 600x600x50 @ ₹449)
  const [fallbackQty, setFallbackQty] = useState<number>(1);

  // Razorpay Modal & Order Confirmation states
  const [isRazorpayOpen, setIsRazorpayOpen] = useState<boolean>(false);
  const [razorpayStep, setRazorpayStep] = useState<'paying' | 'processing'>('paying');
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState<boolean>(false);

  const hasCartItems = cartItems.length > 0;

  const totalItemCount = useMemo(() => {
    if (!hasCartItems) return fallbackQty;
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [hasCartItems, cartItems, fallbackQty]);

  const subtotal = useMemo(() => {
    if (!hasCartItems) return 449 * fallbackQty;
    return cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [hasCartItems, cartItems, fallbackQty]);

  const discount = useMemo(() => {
    if (appliedCoupon === 'FIRST10') {
      return Math.round(subtotal * 0.1);
    }
    return 0;
  }, [subtotal, appliedCoupon]);

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const gst = Math.round(discountedSubtotal * 0.18);
  const shippingCost = pinVerifiedFreeShipping ? 0 : 99;
  const codFee = selectedPayment === 'cod' ? 40 : 0;
  const finalTotal = discountedSubtotal + gst + shippingCost + codFee;

  const handleVerifyPin = () => {
    if (!pinCode || pinCode.trim().length < 6) {
      onShowToast('Please enter a valid 6-digit Indian PIN code.', 'error');
      return;
    }
    setIsVerifyingPin(true);
    setTimeout(() => {
      setIsVerifyingPin(false);
      setPinVerifiedFreeShipping(true);
      onShowToast('PIN Verified! Free Express Shipping unlocked.', 'verified');
    }, 700);
  };

  const handleApplyPromoCode = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'FIRST10') {
      setAppliedCoupon('FIRST10');
      setCouponFeedback({
        type: 'success',
        text: 'Coupon FIRST10 applied! 10% instant discount.',
      });
      onShowToast('Coupon FIRST10 applied! 10% discount unlocked.', 'sell');
    } else if (code === '') {
      setCouponFeedback({
        type: 'error',
        text: 'Please enter a coupon code.',
      });
    } else {
      setCouponFeedback({
        type: 'error',
        text: 'Invalid coupon code. Try FIRST10.',
      });
    }
  };

  const handleTriggerPayment = () => {
    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !emailAddress.trim() ||
      !shippingAddress.trim()
    ) {
      onShowToast('Please fill out all shipping details before proceeding.', 'error');
      return;
    }
    setRazorpayStep('paying');
    setIsRazorpayOpen(true);
  };

  const handleSimulateApproval = () => {
    setRazorpayStep('processing');
    setTimeout(() => {
      setIsRazorpayOpen(false);
      setIsOrderConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onShowToast('Payment confirmed! Order #MX-84920 placed.', 'check_circle');
    }, 1200);
  };

  return (
    <div className="bg-[#f8fafc] text-[#334155] min-h-screen pt-20 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 pt-8 pb-20">
        {/* Universal Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#717975] mb-4">
          <button
            type="button"
            onClick={onBackToStore}
            className="hover:text-[#00231b] transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 text-[#717975] font-medium"
            title="Back to Home"
          >
            <span className="material-symbols-outlined text-[15px]">home</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={onBackToProducts}
            className="hover:text-[#00231b] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-medium text-[#717975]"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-[#00231b] font-bold">Checkout</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToProducts}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-[#e2e8f0]/60 hover:bg-[#e2e8f0] rounded-xl transition-all duration-150 group cursor-pointer border-0"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to Products</span>
          </button>
        </div>

        {!isOrderConfirmed ? (
          <>
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a2c3a] tracking-tight">
                Complete Your Purchase
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Provide your delivery details and choose your preferred payment mode.
              </p>
            </div>

            {/* Two-Column Checkout Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* BEGIN: Shipping & Payment Column (7 cols) */}
              <section className="lg:col-span-7 space-y-6">
                {/* Shipping Details Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1a2c3a] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                        1
                      </span>
                      Shipping Details
                    </h2>
                    <span className="text-xs text-slate-400">
                      All fields mandatory
                    </span>
                  </div>

                  <form
                    className="space-y-5"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {/* Name & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                          htmlFor="fullName"
                        >
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f] transition-all"
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-xs text-slate-400 font-semibold">
                            +91
                          </span>
                          <input
                            id="phoneNumber"
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="9876543210"
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                        htmlFor="emailAddress"
                      >
                        Email Address
                      </label>
                      <input
                        id="emailAddress"
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f] transition-all"
                      />
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <label
                        className="block text-xs font-semibold text-slate-700 mb-1.5"
                        htmlFor="shippingAddress"
                      >
                        Shipping Address
                      </label>
                      <textarea
                        id="shippingAddress"
                        rows={3}
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Street, Industrial Area, Unit/Plot No."
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f] resize-y transition-all"
                      />
                    </div>

                    {/* City, PIN Code, State Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                      {/* City */}
                      <div className="sm:col-span-4">
                        <label
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                          htmlFor="city"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ahmedabad"
                          className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f] transition-all"
                        />
                      </div>

                      {/* PIN Code with integrated Verify Button */}
                      <div className="sm:col-span-4">
                        <label
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                          htmlFor="pinCode"
                        >
                          PIN Code
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="pinCode"
                            type="text"
                            maxLength={6}
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                            placeholder="380001"
                            className="w-full pl-3.5 pr-20 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f] transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyPin}
                            className="absolute right-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all border border-slate-200/60 flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              {isVerifyingPin
                                ? 'Checking'
                                : pinVerifiedFreeShipping
                                ? 'Verified'
                                : 'Verify'}
                            </span>
                            {isVerifyingPin && (
                              <span className="w-3 h-3 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* State */}
                      <div className="sm:col-span-4">
                        <label
                          className="block text-xs font-semibold text-slate-700 mb-1.5"
                          htmlFor="state"
                        >
                          State
                        </label>
                        <input
                          id="state"
                          type="text"
                          required
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="Gujarat"
                          className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f] transition-all"
                        />
                      </div>
                    </div>

                    {/* Pincode feedback alert */}
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-emerald-600 text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        {pinVerifiedFreeShipping ? (
                          <span>
                            <strong>Verified ({city}, {stateName}):</strong> Free
                            Express Shipping unlocked!
                          </span>
                        ) : (
                          <span>
                            <strong>PIN Verified:</strong> Serviceable area (
                            {city}, {stateName}). Express dispatch available.
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded self-start sm:self-auto whitespace-nowrap">
                        {pinVerifiedFreeShipping
                          ? 'Eligible for Free Delivery'
                          : 'Fastest 2-Day Delivery'}
                      </span>
                    </div>
                  </form>
                </div>

                {/* Selectable Payment Options Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-[#1a2c3a] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                        2
                      </span>
                      Payment Mode
                    </h2>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        verified_user
                      </span>
                      256-Bit SSL Encrypted
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'upi',
                        title: 'UPI / QR Instant',
                        desc: 'GPay, PhonePe, Paytm',
                        icon: 'qr_code_scanner',
                      },
                      {
                        id: 'card',
                        title: 'Cards & NetBanking',
                        desc: 'Visa, MasterCard, Corporate',
                        icon: 'credit_card',
                      },
                      {
                        id: 'cod',
                        title: 'Pay on Delivery',
                        desc: '+₹40 convenience fee',
                        icon: 'local_shipping',
                      },
                    ].map((method) => {
                      const active = selectedPayment === method.id;
                      return (
                        <label
                          key={method.id}
                          onClick={() =>
                            setSelectedPayment(
                              method.id as 'upi' | 'card' | 'cod'
                            )
                          }
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                            active
                              ? 'border-[#00856f] bg-emerald-50/20 ring-1 ring-[#00856f]'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#00856f] text-xl">
                              {method.icon}
                            </span>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={active}
                              onChange={() =>
                                setSelectedPayment(
                                  method.id as 'upi' | 'card' | 'cod'
                                )
                              }
                              className="text-[#00856f] focus:ring-[#00856f]"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              {method.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {method.desc}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </section>
              {/* END: Shipping & Payment Column */}

              {/* BEGIN: OrderSummaryCard (5 cols) */}
              <section className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1a2c3a]">
                    Order Summary
                  </h2>
                </div>

                {/* Product Line Items with Quantity Adjusters */}
                <div className="space-y-4 pb-5 border-b border-slate-100 max-h-72 overflow-y-auto pr-1">
                  {hasCartItems ? (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                            <span className="material-symbols-outlined">
                              grid_view
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-snug">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {item.edgeCoating || 'High efficiency cellulose pad'}
                            </p>
                            {/* Interactive Quantity selector */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-slate-500">Qty:</span>
                              <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-l-lg transition-colors font-bold text-sm cursor-pointer"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-r-lg transition-colors font-bold text-sm cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-bold text-slate-900 tracking-tight">
                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="block text-[11px] text-slate-400">
                            ₹{item.unitPrice.toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Fallback Item matching HTML prototype */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                          <span className="material-symbols-outlined">
                            grid_view
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            CelPad 600×600×50
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            High efficiency cellulose pad
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500">Qty:</span>
                            <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50">
                              <button
                                type="button"
                                onClick={() =>
                                  setFallbackQty(Math.max(1, fallbackQty - 1))
                                }
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-l-lg transition-colors font-bold text-sm cursor-pointer"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-slate-800">
                                {fallbackQty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setFallbackQty(fallbackQty + 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-r-lg transition-colors font-bold text-sm cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-slate-900 tracking-tight">
                          ₹{(449 * fallbackQty).toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          ₹449 each
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Promo Code Box */}
                <div className="pt-4 pb-2">
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                    htmlFor="couponCode"
                  >
                    Have a Promo Code?
                  </label>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        sell
                      </span>
                      <input
                        id="couponCode"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter 'FIRST10'"
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00856f]/20 focus:border-[#00856f]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromoCode}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Coupon status badge */}
                  {couponFeedback && (
                    <div
                      className={`mt-2 text-xs flex items-center gap-1 ${
                        couponFeedback.type === 'success'
                          ? 'text-emerald-700 font-semibold'
                          : 'text-rose-600 font-medium'
                      }`}
                    >
                      {couponFeedback.type === 'success' && (
                        <span className="material-symbols-outlined text-sm">
                          verified
                        </span>
                      )}
                      <span>{couponFeedback.text}</span>
                    </div>
                  )}
                </div>

                {/* Breakdown Calculations */}
                <div className="space-y-3 pt-4 text-sm border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Subtotal ({totalItemCount} item
                      {totalItemCount > 1 ? 's' : ''})
                    </span>
                    <span className="font-medium text-slate-800">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        Promo Discount (FIRST10)
                      </span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      GST (18%)
                      <span
                        className="material-symbols-outlined text-[14px] text-slate-400 cursor-pointer"
                        title="Calculated as per Indian B2B standards"
                      >
                        info
                      </span>
                    </span>
                    <span className="font-medium text-slate-800">
                      ₹{gst.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <div className="text-right">
                      {pinVerifiedFreeShipping && (
                        <span className="line-through text-xs text-slate-400 mr-1.5">
                          ₹99
                        </span>
                      )}
                      <span className="font-medium text-slate-800">
                        {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                      </span>
                    </div>
                  </div>

                  {codFee > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span>COD Convenience Fee</span>
                      <span className="font-medium">₹{codFee}</span>
                    </div>
                  )}
                </div>

                {/* Dotted Divider */}
                <div className="my-5 border-t border-dashed border-slate-200" />

                {/* Total Calculation */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-base font-bold text-slate-900 block">
                      Total Amount
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Inclusive of all taxes &amp; delivery
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#00856f] tracking-tight">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Checkout Action Button */}
                <button
                  type="button"
                  onClick={handleTriggerPayment}
                  className="w-full bg-[#00856f] hover:bg-[#00705e] active:scale-[0.99] text-white font-semibold py-4 px-4 rounded-xl shadow-lg shadow-emerald-900/10 transition-all duration-150 flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    lock
                  </span>
                  <span>
                    Complete Payment •{' '}
                    <strong>₹{finalTotal.toLocaleString('en-IN')}</strong>
                  </span>
                </button>

                {/* Trust & Security Microcopy */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-slate-400 text-xs text-center">
                  <div className="flex items-center justify-center gap-4 text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-600">
                        verified_user
                      </span>{' '}
                      100% Genuine
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-600">
                        cached
                      </span>{' '}
                      Easy Returns
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-600">
                        receipt_long
                      </span>{' '}
                      GST Invoice
                    </span>
                  </div>
                  <span className="text-[11px]">
                    Secure payment gateway processed by Razorpay &amp; Maxima
                    Financial
                  </span>
                </div>
              </section>
              {/* END: OrderSummaryCard */}
            </div>
          </>
        ) : (
          /* BEGIN: Order Confirmation Success View (Revealed after payment) */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span
                className="material-symbols-outlined text-4xl font-bold"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-100/80 text-emerald-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              Payment Confirmed
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Order #MX-84920 Confirmed!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
              Thank you for purchasing with{' '}
              <strong className="text-slate-900">MAXIMAIR</strong>. We have
              dispatched a confirmation email &amp; GST Tax Invoice to{' '}
              <span className="font-semibold text-slate-800">
                {emailAddress}
              </span>
              .
            </p>

            {/* Receipt Box */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left text-xs text-slate-600 space-y-3 mb-8">
              <div className="flex justify-between pb-3 border-b border-slate-200 font-semibold text-slate-800 text-sm">
                <span>Order Details</span>
                <span className="text-emerald-700">
                  {selectedPayment === 'cod'
                    ? 'Confirmed (Pay on Delivery)'
                    : 'PAID via Razorpay UPI'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono text-slate-800 font-medium">
                  pay_N9hD41xOpqL28
                </span>
              </div>
              <div className="flex justify-between">
                <span>Item(s):</span>
                <span className="text-slate-800 font-medium text-right">
                  {hasCartItems
                    ? cartItems
                        .map((i) => `${i.quantity}x ${i.product.name}`)
                        .join(', ')
                    : `${fallbackQty}x CelPad 600×600×50`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address:</span>
                <span className="text-slate-800 font-medium text-right max-w-xs">
                  {shippingAddress}, {city} - {pinCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="text-slate-800 font-bold">
                  In 2 business days
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700 text-base">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setTrackingModalOpen(true);
                  onShowToast(
                    'Consignment Tracking ID: DLV-9932014. Tracking sent via SMS.',
                    'local_shipping'
                  );
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#00856f] hover:bg-[#00705e] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  local_shipping
                </span>
                <span>Track Consignment</span>
              </button>
              <button
                type="button"
                onClick={onBackToStore}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  storefront
                </span>
                <span>Back to Store</span>
              </button>
            </div>

            {trackingModalOpen && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-emerald-700">
                    local_shipping
                  </span>
                  <div>
                    <strong>Consignment ID: DLV-9932014</strong> — Dispatched from
                    Ahmedabad Hub. Live SMS tracking sent to +91 {phoneNumber}.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTrackingModalOpen(false)}
                  className="text-emerald-700 font-bold ml-3 cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
          /* END: Order Confirmation Success View */
        )}
      </main>

      {/* BEGIN: Razorpay Simulator Modal */}
      {isRazorpayOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsRazorpayOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Razorpay Header */}
            <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-white/10 p-1 flex items-center justify-center font-black text-blue-400">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">
                    Razorpay Trusted
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    MAXIMAIR Industrial Systems
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300">Amount</span>
                <div className="text-lg font-bold text-white">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {razorpayStep === 'paying' ? (
              /* Razorpay Step 1: Processing QR / UPI */
              <div className="p-6 text-center space-y-5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                  <div className="w-36 h-36 bg-white p-2 rounded-lg border border-slate-200 shadow-inner flex flex-col items-center justify-center relative">
                    {/* Simulated QR code pattern */}
                    <div className="grid grid-cols-6 gap-1 w-28 h-28 opacity-80">
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-200 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-200 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-200 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-200 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-200 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                      <div className="bg-white rounded-sm" />
                      <div className="bg-slate-900 rounded-sm" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-[10px] font-black text-emerald-800 border">
                        M
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 font-medium">
                    Scan with any UPI App or tap Approve below
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Awaiting payment approval...</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRazorpayOpen(false)}
                    className="w-1/2 py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateApproval}
                    className="w-1/2 py-2.5 px-4 text-xs font-semibold text-white bg-[#0c2340] hover:bg-[#13335a] rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Simulate Approval</span>
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* Razorpay Step 2: Processing Spinner */
              <div className="p-10 text-center space-y-4">
                <div className="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">
                  Verifying with Bank...
                </h4>
                <p className="text-xs text-slate-500">
                  Please do not press back or refresh the page.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* END: Razorpay Simulator Modal */}
    </div>
  );
};
