import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onQuickAddDefault: () => void;
  onProceedToCheckout: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onQuickAddDefault,
  onProceedToCheckout,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const itemsList = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.product.name} [Coating: ${i.edgeCoating}] × ${i.quantity} units @ ₹${i.unitPrice}/u = ₹${(
            i.unitPrice * i.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n');

    const msg = encodeURIComponent(
      `Hello MAXIMAIR Sales,\nI would like to order the following CelPad units:\n\n${itemsList}\n\n` +
        `Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n` +
        `Estimated GST (18%): ₹${tax.toLocaleString('en-IN')}\n` +
        `Total Payable: ₹${total.toLocaleString('en-IN')}\n\n` +
        `Please confirm shipping dispatch timeline to my facility.`
    );

    onShowToast('Connecting to MAXIMAIR WhatsApp Sales...', 'shopping_cart_checkout');
    setTimeout(() => {
      window.open(`https://wa.me/919825141727?text=${msg}`, '_blank');
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-[#eae8e5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#eae8e5] flex items-center justify-between bg-[#f5f3f0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4f] text-2xl">
              shopping_bag
            </span>
            <h2 className="font-extrabold text-lg text-[#00231b]">Your Order Review</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#eae8e5] flex items-center justify-center text-[#00231b] transition active:scale-95 cursor-pointer shadow-sm"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#f5f3f0] flex items-center justify-center text-[#717975]">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              </div>
              <div>
                <p className="text-base font-bold text-[#00231b]">Your cart is empty</p>
                <p className="text-xs text-[#717975] mt-1 max-w-xs">
                  Choose from our standard sizes or customize pad dimensions for your frame.
                </p>
              </div>
              <button
                onClick={onQuickAddDefault}
                className="px-5 py-2.5 rounded-xl bg-[#00231b] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#006c4f] transition cursor-pointer shadow-sm"
              >
                Add 1800 × 600 Standard Unit
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#f5f3f0] border border-[#eae8e5] flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-[#00231b]">{item.product.name}</h4>
                    <span className="text-[11px] font-semibold text-[#006c4f] block">
                      {item.edgeCoating}
                    </span>
                    <span className="text-xs text-[#717975] font-medium">
                      ₹{item.unitPrice.toLocaleString('en-IN')} / unit
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#717975] hover:text-[#ba1a1a] transition-colors p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#eae8e5]">
                  <div className="flex items-center border border-[#eae8e5] rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-[#00231b] hover:bg-[#eae8e5] transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#00231b]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-[#00231b] hover:bg-[#eae8e5] transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-extrabold text-sm text-[#00231b]">
                    ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#eae8e5] bg-[#f5f3f0] space-y-3">
            <div className="space-y-1.5 text-xs text-[#717975] pb-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#00231b]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="font-semibold text-[#00231b]">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="border-t border-[#eae8e5] pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#00231b]">Total Payable</span>
                <span className="text-2xl font-black text-[#006c4f]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-4 rounded-xl bg-[#00856f] hover:bg-[#00705e] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">lock</span>
              <span>Proceed to Payment Checkout</span>
            </button>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-3 rounded-xl bg-[#00231b] hover:bg-[#006c4f] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>Quick Order via WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
