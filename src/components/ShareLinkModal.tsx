import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, ExternalLink } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuestName: string;
}

const COMMON_GUEST_HONORIFICS = [
  'ឯកឧត្តម និងលោកជំទាវ',
  'លោកជំទាវ',
  'ឯកឧត្តម',
  'លោកអ្នកមានកិត្តិយស',
  'លោកពូ និងអ្នកមីង',
  'បងប្អូន និងមិត្តភក្តិទាំងអស់គ្នា',
];

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose, currentGuestName }) => {
  const [customName, setCustomName] = useState(currentGuestName);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = customName.trim()
    ? `${baseUrl}?guest=${encodeURIComponent(customName.trim())}`
    : baseUrl;

  const shareText = `សូមគោរពអញ្ជើញ ${customName.trim() || 'លោកអ្នកមានកិត្តិយស'} ចូលរួមក្នុងពិធីសិរីមង្គលអាពាហ៍ពិពាហ៍ និងពិធីជប់លៀងអាហារពេលល្ងាច (វិចិត្រ & ចរិយា) ថ្ងៃទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦ នៅកោះពេជ្រ អគារ G៖ ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank');
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ចែករំលែកសំបុត្រអញ្ជើញ"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg bg-[#141210] rounded-2xl border border-amber-500/40 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-moul text-base text-gold-gradient">
              បង្កើតតំណភ្ជាប់អញ្ជើញភ្ញៀវ
            </h3>
            <p className="text-xs text-stone-400">
              Customize & Share Personalized Invitation Link
            </p>
          </div>
        </div>

        {/* Input Name */}
        <div className="space-y-3 mb-5">
          <label className="block text-xs font-medium text-stone-200">
            ឈ្មោះភ្ញៀវដែលត្រូវទទួលសំបុត្រ (Guest Title & Name)
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="ឧ. ឯកឧត្តម... / លោកពូ... / មិត្តភក្តិ..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
          />

          {/* Quick honorific chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_GUEST_HONORIFICS.map((honorific) => (
              <button
                key={honorific}
                type="button"
                onClick={() => setCustomName(honorific)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-200 border border-stone-700/60 transition-colors cursor-pointer"
              >
                {honorific}
              </button>
            ))}
          </div>
        </div>

        {/* Generated URL Box */}
        <div className="p-3 rounded-xl bg-black/60 border border-stone-800 text-xs mb-5">
          <span className="text-[11px] text-stone-400 block mb-1">
            តំណភ្ជាប់ផ្ទាល់ខ្លួន (Your Custom Link):
          </span>
          <p className="font-mono text-[11px] text-amber-200/90 break-all select-all">
            {shareUrl}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-stone-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'បានចម្លងតំណភ្ជាប់ជោគជ័យ!' : 'ចម្លងតំណភ្ជាប់ (Copy Link)'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTelegramShare}
              className="py-2 px-3 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 text-[#229ED9] border border-[#229ED9]/40 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ផ្ញើតាម Telegram</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp / Chat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
