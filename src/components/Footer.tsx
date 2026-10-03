import React from 'react';
import { Heart, Phone, Send } from 'lucide-react';
import { WEDDING_DETAILS } from '../data/weddingData';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-stone-800/90 bg-[#080706] text-stone-400 text-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Couple Wordmark */}
        <div className="font-moul text-lg text-gold-gradient tracking-wide">
          {WEDDING_DETAILS.groom.nameKhmer} & {WEDDING_DETAILS.bride.nameKhmer}
        </div>

        {/* Traditional Thank-you Note */}
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
          យើងខ្ញុំទាំងពីរនាក់ ព្រមទាំងមាតាបិតាទាំងសងខាង សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅបំផុត ចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តម និងសមានចិត្តដ៏ថ្លៃថ្លារបស់លោកអ្នក ដែលបានអញ្ជើញចូលរួមជាកិត្តិយសក្នុងថ្ងៃដ៏វិសេសវិសាលនេះ។
        </p>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
          {WEDDING_DETAILS.contacts.map((contact) => (
            <div key={contact.name} className="flex items-center gap-2 text-stone-400">
              <span className="text-amber-400 font-medium">{contact.roleKhmer} ({contact.name}):</span>
              <a
                href={`tel:${contact.phone}`}
                className="hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-stone-400" />
                <span>{contact.phone}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-stone-900 text-[11px] text-stone-400 flex items-center justify-center gap-1">
          <span>បង្កើតឡើងដោយក្តីស្រឡាញ់ សម្រាប់ពិធីមង្គលការ</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>ឆ្នាំ២០២៦</span>
        </div>

      </div>
    </footer>
  );
};
