import React, { useState } from 'react';
import { Gift, Copy, Check, QrCode, Heart, Eye, X } from 'lucide-react';
import { PaymentMethod } from '../types/fullstack';

interface GiftEnvelopeSectionProps {
  paymentMethods?: PaymentMethod[];
}

export const GiftEnvelopeSection: React.FC<GiftEnvelopeSectionProps> = ({ paymentMethods = [] }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingQr, setViewingQr] = useState<string | null>(null);

  const activeMethods = paymentMethods.filter((p) => p.enabled);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="gift-section" className="py-14 md:py-20 border-t border-stone-800/80 relative bg-[#0e0c0b]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Section Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
          <Gift className="w-3.5 h-3.5" />
          <span>ចំណងដៃឌីជីថល</span>
        </div>
        <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-3">
          កាដូ & ចំណងដៃមង្គលការ
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mb-8 max-w-lg mx-auto">
          វត្តមានដ៏ឧត្តុង្គឧត្តមរបស់លោកអ្នក គឺជាកិត្តិយស និងជាកាដូដ៏វិសេសវិសាលបំផុតសម្រាប់យើងខ្ញុំទាំងពីរ។
        </p>

        {/* Traditional Gift Box Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141210] border border-amber-500/30 shadow-2xl relative max-w-2xl mx-auto">
          <p className="text-xs text-stone-300 mb-6 leading-relaxed">
            សម្រាប់ការជូនពរ និងចំណងដៃឌីជីថល តាមរយៈការស្កេន QR Code ឬផ្ទេរប្រាក់ដោយក្តីស្រឡាញ់ និងការដឹងគុណយ៉ាងជ្រាលជ្រៅ
          </p>

          {activeMethods.length === 0 ? (
            <div className="p-6 text-center text-stone-500 text-xs">
              ព័ត៌មានចំណងដៃឌីជីថលកំពុងត្រូវបានរៀបចំ។
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeMethods.map((method) => (
                <div
                  key={method.id}
                  className="p-4 rounded-xl bg-gradient-to-b from-[#181512] to-[#100e0d] border border-amber-500/30 text-left flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-400 text-sm tracking-wider">
                        {method.providerName}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {method.currency}
                      </span>
                    </div>

                    <span className="text-[11px] text-stone-400 block mb-0.5">
                      ឈ្មោះគណនី (Account Name)
                    </span>
                    <p className="text-xs font-semibold text-stone-100 truncate mb-2">
                      {method.accountName || 'SOK VICHET & CHEA CHARIYA'}
                    </p>

                    <span className="text-[11px] text-stone-400 block mb-0.5">
                      លេខគណនី (Account Number)
                    </span>
                    <p className="font-mono text-sm font-bold text-amber-200">
                      {method.accountNumber}
                    </p>

                    {/* QR Code thumbnail if available */}
                    {method.qrImage && (
                      <div className="mt-3 text-center">
                        <button
                          type="button"
                          onClick={() => setViewingQr(method.qrImage)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-stone-700 text-stone-300 text-[11px] hover:text-amber-300 hover:border-amber-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>មើល QR Code សម្រាប់ស្កេន</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopy(method.id, method.accountNumber.replace(/[^0-9]/g, ''))}
                    className="mt-4 w-full py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === method.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === method.id ? 'បានចម្លង!' : `ចម្លងលេខកុង ${method.providerName}`}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-stone-400 mt-6 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
            <span>សូមអរគុណយ៉ាងជ្រាលជ្រៅចំពោះទឹកចិត្តដ៏ថ្លៃថ្លារបស់លោកអ្នក</span>
          </p>
        </div>

      </div>

      {/* QR Modal Lightbox */}
      {viewingQr && (
        <div
          onClick={() => setViewingQr(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="relative max-w-sm bg-white p-5 rounded-2xl shadow-2xl text-center">
            <button
              onClick={() => setViewingQr(null)}
              className="absolute -top-10 right-0 text-white p-1 hover:text-amber-400"
            >
              <X className="w-6 h-6" />
            </button>
            <p className="text-xs font-bold text-stone-900 mb-2 font-moul">ស្កេនដើម្បីផ្ទេរចំណងដៃ</p>
            <img src={viewingQr} alt="QR Code" className="w-full h-auto rounded-lg mx-auto" />
            <p className="text-[11px] text-stone-500 mt-2">សូមបើក App ធនាគាររបស់អ្នកដើម្បីស្កេន</p>
          </div>
        </div>
      )}
    </section>
  );
};
