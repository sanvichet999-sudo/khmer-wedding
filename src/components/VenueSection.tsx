import React, { useState } from 'react';
import { MapPin, Navigation, Car, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { WEDDING_DETAILS } from '../data/weddingData';
import { WeddingEvent } from '../types/fullstack';

interface VenueSectionProps {
  wedding?: WeddingEvent;
  onOpenImageModal: (src: string, alt: string) => void;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ wedding, onOpenImageModal }) => {
  const [copied, setCopied] = useState(false);

  const venueNameKhmer = wedding?.venueNameKhmer || WEDDING_DETAILS.venue.nameKhmer;
  const addressKhmer = wedding?.addressKhmer || WEDDING_DETAILS.venue.addressKhmer;
  const addressEnglish = wedding?.addressEnglish || WEDDING_DETAILS.venue.addressEnglish;
  const venueImage = wedding?.venueImage || '/src/assets/images/wedding_venue_exterior_1791004229963.jpg';
  const googleMapsUrl = wedding?.googleMapsUrl || WEDDING_DETAILS.venue.googleMapsUrl;
  const appleMapsUrl = wedding?.appleMapsUrl || WEDDING_DETAILS.venue.appleMapsUrl;
  const parkingInfoKhmer = wedding?.parkingInfoKhmer || WEDDING_DETAILS.venue.parkingNoteKhmer;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venueNameKhmer}, ${addressKhmer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="venue-section" className="py-14 md:py-20 border-t border-stone-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-medium mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>ទីតាំងជាក់លាក់</span>
          </div>
          <h2 className="font-moul text-xl sm:text-2xl text-gold-gradient mb-3">
            ទីតាំងរៀបចំពិធីមង្គលការ & ជប់លៀង
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            {wedding?.hallKhmer || WEDDING_DETAILS.venue.hallKhmer}
          </p>
        </div>

        {/* Venue Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Venue Visuals & Details */}
          <div className="lg:col-span-6 space-y-5">
            {/* Exterior Venue Photo */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 group">
              <div className="aspect-4/3 w-full bg-[#181512]">
                <img
                  src={venueImage}
                  alt="អគារមជ្ឈមណ្ឌលកោះពេជ្រ អគារ G"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div>
                  <span className="text-xs font-semibold text-amber-300 block">ច្រកចូលធំ អគារ G (Building G)</span>
                  <p className="text-xs text-stone-300">ក្លោងទ្វារផ្កាស្វាគមន៍ និងកម្រាលព្រំក្រហម</p>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="p-5 rounded-2xl bg-[#141210] border border-stone-800">
              <h3 className="font-moul text-base text-stone-100 mb-2">
                {venueNameKhmer}
              </h3>
              <p className="text-xs text-stone-300 mb-1 leading-relaxed">
                {addressKhmer}
              </p>
              <p className="text-[11px] text-stone-400 mb-4">
                {addressEnglish}
              </p>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleCopyAddress}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'បានចម្លងអាសយដ្ឋាន!' : 'ចម្លងអាសយដ្ឋាន'}</span>
                </button>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>បើក Google Maps</span>
                </a>

                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1e1c19] text-amber-200 border border-amber-500/30 hover:bg-amber-500/10 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Apple Maps</span>
                </a>
              </div>
            </div>

            {/* Parking and Access Amenities */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
              <div className="flex items-start gap-2.5 text-stone-300">
                <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-200">ចំណតយានយន្ត៖</strong> {parkingInfoKhmer}
                </p>
              </div>
              <div className="flex items-start gap-2.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-amber-200">សេវាដឹកជញ្ជូន៖</strong> អាចកក់តាម PassApp ឬ Grab ដោយវាយពាក្យថា <em>"Koh Pich Exhibition Center Hall G"</em>។
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Embed & Directions */}
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-[#141210] shadow-xl">
              <div className="p-3 bg-[#181512] border-b border-stone-800 flex items-center justify-between text-xs">
                <span className="font-medium text-amber-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>ផែនទីទីតាំងកោះពេជ្រ (Koh Pich, Phnom Penh)</span>
                </span>
                <span className="text-stone-400 font-mono text-[11px]">11.5478° N, 104.9415° E</span>
              </div>

              {/* OpenStreetMap Iframe centered at Koh Pich, Phnom Penh */}
              <div className="relative w-full h-[340px] bg-stone-900">
                <iframe
                  title="Koh Pich Exhibition Center Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=104.9350%2C11.5430%2C104.9520%2C11.5540&layer=mapnik&marker=11.5478%2C104.9415"
                  className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180 contrast-125"
                  loading="lazy"
                />
                
                {/* Floating Map Pin Badge */}
                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-left pointer-events-none">
                  <p className="font-moul text-xs text-amber-300">អគារ G កោះពេជ្រ</p>
                  <p className="text-[10px] text-stone-300">មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍</p>
                </div>
              </div>

              <div className="p-4 bg-[#141210] text-center border-t border-stone-800">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-semibold text-xs hover:from-amber-300 hover:to-amber-400 transition-colors shadow-sm cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>មើលផ្លូវធ្វើដំណើរលើ Google Maps ផ្ទាល់</span>
                </a>
              </div>
            </div>

            {/* Travel Steps */}
            <div className="p-5 rounded-2xl bg-[#141210] border border-stone-800 space-y-3">
              <h4 className="font-medium text-amber-300 text-xs uppercase tracking-wider">
                ការណែនាំផ្លូវធ្វើដំណើរ
              </h4>
              <ul className="text-xs text-stone-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>ឆ្លងកាត់ស្ពានកោះពេជ្រ (ស្ពានហង្ស ឬ ស្ពាននាគភ្លោះ) ចូលមកកោះពេជ្រ។</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>ធ្វើដំណើរត្រង់តាមមហាវិថីកោះពេជ្រ សំដៅទៅកាន់មជ្ឈមណ្ឌលពិព័រណ៍។</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>អគារ G ស្ថិតនៅខាងស្តាំដៃ មានក្លោងទ្វារផ្កា និងស្លាកឈ្មោះកូនកំលោះ-កូនក្រមុំយ៉ាងច្បាស់។</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

