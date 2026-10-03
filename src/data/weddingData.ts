import { GalleryPhoto, GuestWish, WeddingScheduleItem } from '../types/wedding';

// Import generated images
import heroWeddingImg from '../assets/images/hero_khmer_wedding_1791004183585.jpg';
import banquetDinnerImg from '../assets/images/wedding_dinner_banquet_1791004202568.jpg';
import preweddingCoupleImg from '../assets/images/khmer_prewedding_couple_1791004216374.jpg';
import venueExteriorImg from '../assets/images/wedding_venue_exterior_1791004229963.jpg';

export const WEDDING_DETAILS = {
  // Couple Info
  groom: {
    nameKhmer: 'សុខ វិចិត្រ',
    nameEnglish: 'Sok Vichet',
    titleKhmer: 'កូនប្រុស',
    parentsKhmer: 'លោក សុខ ចិន្តា និង លោកស្រី អ៊ុំ សោភា',
    parentsEnglish: 'Mr. Sok Chenda & Mrs. Oum Sophea',
  },
  bride: {
    nameKhmer: 'ជា ចរិយា',
    nameEnglish: 'Chea Chariya',
    titleKhmer: 'កូនស្រី',
    parentsKhmer: 'លោក ជា ប៊ុនថន និង លោកស្រី ម៉ី វណ្ណា',
    parentsEnglish: 'Mr. Chea Bunthorn & Mrs. Mey Vanna',
  },

  // Auspicious Date and Time
  eventDateISO: '2026-11-15T17:00:00+07:00', // Sunday Nov 15, 2026 5:00 PM
  dateKhmer: 'ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
  lunarDateKhmer: 'ត្រូវនឹង ថ្ងៃ ៧ កើត ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០',
  dateEnglish: 'Sunday, November 15, 2026',
  dinnerTimeKhmer: 'វេលាម៉ោង ៥:០០ នាទីល្ងាច',
  dinnerTimeEnglish: 'From 5:00 PM onwards',

  // Venue Details (Specific Location)
  venue: {
    nameKhmer: 'មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ (អគារ G)',
    nameEnglish: 'Koh Pich Exhibition & Convention Center (Building G)',
    hallKhmer: 'សាលមង្គល អគារ G (Diamond Island Grand Ballroom G)',
    addressKhmer: 'ផ្លូវកោះពេជ្រ សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
    addressEnglish: 'Koh Pich St., Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh, Cambodia',
    googleMapsUrl: 'https://maps.google.com/?q=Koh+Pich+Convention+Center+Phnom+Penh',
    appleMapsUrl: 'https://maps.apple.com/?q=Koh+Pich+Convention+Center+Phnom+Penh',
    coordinates: {
      lat: 11.5478,
      lng: 104.9415,
    },
    parkingNoteKhmer: 'មានចំណតរថយន្ត និងទោចក្រយានយន្តយ៉ាងធំទូលាយ ព្រមទាំងមានបុគ្គលិកជួយសម្រួលការចតដោយឥតគិតថ្លៃ។',
    parkingNoteEnglish: 'Spacious complimentary vehicle and motorcycle parking with on-site security assistance.',
  },

  // Dress Code
  dressCode: {
    titleKhmer: 'ពណ៌សម្លៀកបំពាក់កិត្តិយស',
    titleEnglish: 'Dress Code & Color Theme',
    descriptionKhmer: 'សម្លៀកបំពាក់ប្រពៃណីខ្មែរ ឬ ឈុតរាត្រីសមោសរស្រស់សង្ហារ',
    palette: [
      { nameKhmer: 'ពណ៌មាសស្រទន់', nameEnglish: 'Champagne Gold', hex: '#E5C07B', border: '#D4AF37' },
      { nameKhmer: 'ពណ៌ផ្កាឈូកមាស', nameEnglish: 'Rose Gold', hex: '#E0A899', border: '#C77D6E' },
      { nameKhmer: 'ពណ៌សភ្លុក', nameEnglish: 'Ivory White', hex: '#FDFBF7', border: '#E2D9C8' },
      { nameKhmer: 'ពណ៌ខៀវរាត្រី', nameEnglish: 'Midnight Blue', hex: '#1E293B', border: '#334155' },
    ],
  },

  // Banking / QR Gift Info
  giftInfo: {
    abaName: 'SOK VICHET & CHEA CHARIYA',
    abaAccount: '001 888 999 (USD)',
    acledaName: 'SOK VICHET',
    acledaAccount: '010-888-777-66 (KHR)',
    qrNoteKhmer: 'សម្រាប់ការជូនពរ និងចំណងដៃឌីជីថល ដោយក្តីស្រឡាញ់ និងការដឹងគុណយ៉ាងជ្រាលជ្រៅ',
  },

  // Contact Persons for RSVP assistance
  contacts: [
    { roleKhmer: 'តំណាងខាងកូនប្រុស', name: 'លោក សុខ វិចិត្រ', phone: '+855 12 888 999', telegram: 'vichet_sok' },
    { roleKhmer: 'តំណាងខាងកូនស្រី', name: 'កញ្ញា ជា ចរិយា', phone: '+855 16 777 888', telegram: 'chariya_chea' },
  ],
};

export const WEDDING_SCHEDULE: WeddingScheduleItem[] = [
  // Morning Ceremonies
  {
    id: 'procession',
    time: '០៧:០០ ព្រឹក',
    timeEnglish: '07:00 AM',
    titleKhmer: 'ពិធីហែកំណត់ / ហែជំនូន',
    titleEnglish: 'Engagement & Dowry Procession',
    descriptionKhmer: 'ក្បួនហែជំនូនចូលគេហដ្ឋានមង្គល ជាមួយគ្រឿងអលង្ការ ផ្លែឈើ និងនំចំណីប្រពៃណីខ្មែរ',
    location: 'គេហដ្ឋានខាងស្រី (សង្កាត់ទន្លេបាសាក់)',
    iconType: 'procession',
  },
  {
    id: 'monk-blessing',
    time: '០៨:៣០ ព្រឹក',
    timeEnglish: '08:30 AM',
    titleKhmer: 'ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត',
    titleEnglish: 'Buddhist Monks Blessing Ceremony',
    descriptionKhmer: 'ព្រះសង្ឃសូត្រមន្តប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខជូនដល់គូស្វាមីភរិយាថ្មី',
    location: 'គេហដ្ឋានខាងស្រី',
    iconType: 'monk',
  },
  {
    id: 'hair-cutting',
    time: '០៩:៣០ ព្រឹក',
    timeEnglish: '09:30 AM',
    titleKhmer: 'ពិធីកាត់សក់បង្កក់សិរី & បង្វិលពពិល',
    titleEnglish: 'Hair Cutting & Cleansing Ceremony',
    descriptionKhmer: 'ពិធីជម្រះឧបទ្រពចង្រៃ និងប្រសិទ្ធពរជ័យដោយមាតាបិតា ញាតិមិត្តចាស់ទុំ',
    location: 'គេហដ្ឋានខាងស្រី',
    iconType: 'haircut',
  },
  {
    id: 'family-lunch',
    time: '១១:៣០ ព្រឹក',
    timeEnglish: '11:30 AM',
    titleKhmer: 'ពិធីសែនព្រេន & ទទួលទានអាហារថ្ងៃត្រង់គ្រួសារ',
    titleEnglish: 'Ancestral Blessing & Family Luncheon',
    descriptionKhmer: 'សែនដូនតាតាមប្រពៃណី និងពិសាអាហារសាមគ្គីជួបជុំញាតិមិត្តទាំងសងខាង',
    location: 'គេហដ្ឋានខាងស្រី',
    iconType: 'lunch',
  },

  // Evening Reception & Dinner Banquet (Highlighted)
  {
    id: 'evening-welcome',
    time: '០៥:០០ ល្ងាច',
    timeEnglish: '05:00 PM',
    titleKhmer: 'ពិធីទទួលភ្ញៀវកិត្តិយស & ថតរូបអនុស្សាវរីយ៍',
    titleEnglish: 'Welcome Honorable Guests & Red Carpet Photos',
    descriptionKhmer: 'ស្វាគមន៍ភ្ញៀវកិត្តិយសយ៉ាងកក់ក្តៅ និងថតរូបអនុស្សាវរីយ៍នៅក្លោងទ្វារផ្កាដ៏ស្រស់ត្រកាល',
    location: 'អគារ G មជ្ឈមណ្ឌលកោះពេជ្រ',
    iconType: 'welcome',
  },
  {
    id: 'evening-dinner',
    time: '០៦:៣០ ល្ងាច',
    timeEnglish: '06:30 PM',
    titleKhmer: 'ពិធីជប់លៀងអាហារពេលល្ងាចផ្លូវការ',
    titleEnglish: 'Grand Wedding Banquet & Musical Performance',
    descriptionKhmer: 'ពិសាអាហារពេលល្ងាចប្រណីតជាមួយមុខម្ហូបឈ្ងុយឆ្ងាញ់ អមដោយការប្រគំតន្ត្រីពិរោះរណ្តំ',
    location: 'សាលមង្គល អគារ G កោះពេជ្រ',
    iconType: 'dinner',
  },
  {
    id: 'evening-cake',
    time: '០៧:៣០ ល្ងាច',
    timeEnglish: '07:30 PM',
    titleKhmer: 'ពិធីកាត់នំខេកមង្គល & ចាក់ស្រាសំប៉ាញ',
    titleEnglish: 'Cake Cutting Ceremony & Champagne Toast',
    descriptionKhmer: 'កូនកំលោះ និងកូនក្រមុំកាត់នំខេកមង្គល ចាក់ស្រាសំប៉ាញ និងថ្លែងអំណរគុណភ្ញៀវកិត្តិយស',
    location: 'វេទិកាមង្គល អគារ G',
    iconType: 'cake',
  },
  {
    id: 'evening-dance',
    time: '០៨:៣០ យប់',
    timeEnglish: '08:30 PM',
    titleKhmer: 'ការរាំបើកវង់ & កម្មវិធីរាំកម្សាន្តសប្បាយ',
    titleEnglish: 'First Dance & Celebration Party',
    descriptionKhmer: 'ការរាំកម្សាន្តបន្ធូរអារម្មណ៍ អបអរសាទរថ្ងៃដ៏វិសេសវិសាលជាមួយមិត្តភក្តិ និងបងប្អូន',
    location: 'សាលមង្គល អគារ G',
    iconType: 'dance',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'hero',
    src: heroWeddingImg,
    alt: 'ពិធីសិរីសួស្តី អាពាហ៍ពិពាហ៍បែបប្រពៃណីខ្មែរ',
    captionKhmer: 'កូនកំលោះ និងកូនក្រមុំ ក្នុងឈុតសម្លៀកបំពាក់ប្រពៃណីមង្គលខ្មែរយ៉ាងសមសួន និងថ្លៃថ្នូរ',
    captionEnglish: 'Bride & Groom in regal Cambodian royal silk traditional wedding attire',
    tag: 'ប្រពៃណីខ្មែរ',
  },
  {
    id: 'dinner',
    src: banquetDinnerImg,
    alt: 'សាលពិធីជប់លៀងអាហារពេលល្ងាច',
    captionKhmer: 'ទិដ្ឋភាពសាលជប់លៀងអាហារពេលល្ងាចដ៏ស្រស់ប្រណីត អមដោយពន្លឺចង្កៀងគ្រីស្តាល់ និងផ្កាស្រស់',
    captionEnglish: 'Lavish evening wedding reception banquet ballroom and floral arrangements',
    tag: 'អាហារពេលល្ងាច',
  },
  {
    id: 'couple',
    src: preweddingCoupleImg,
    alt: 'រូបថតអនុស្សាវរីយ៍ Pre-Wedding នៃគូស្នេហ៍',
    captionKhmer: 'ស្នាមញញឹមពោរពេញដោយក្តីស្រឡាញ់ និងភាពកក់ក្តៅក្នុងឈុតរាត្រីសមោសរ',
    captionEnglish: 'Romantic pre-wedding twilight photoshoot in modern evening attire',
    tag: 'អនុស្សាវរីយ៍',
  },
  {
    id: 'venue',
    src: venueExteriorImg,
    alt: 'ទីតាំងរៀបចំពិធីមង្គលការ និងជប់លៀងអាហារពេលល្ងាច',
    captionKhmer: 'អគារសាលមង្គលការ អគារ G កោះពេជ្រ រាជធានីភ្នំពេញ ងាយស្រួលធ្វើដំណើរ និងចតរថយន្ត',
    captionEnglish: 'Koh Pich Convention & Exhibition Grand Ballroom entrance at twilight',
    tag: 'ទីតាំងកម្មវិធី',
  },
];

export const INITIAL_WISHES: GuestWish[] = [
  {
    id: 'w1',
    guestName: 'ឯកឧត្តម និងលោកជំទាវ ហួត សុភ័ក្រ',
    message: 'សូមប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខ មហាប្រសើរ ជូនដល់ក្មួយទាំងពីរ ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង រកស៊ីមានបាន ត្រជាក់ត្រជុំដូចទឹកអង្គរ!',
    relationship: 'ភ្ញៀវកិត្តិយស',
    timestamp: '២ ម៉ោងមុន',
    likes: 18,
  },
  {
    id: 'w2',
    guestName: 'បងស្រី រ័ត្ន ធីតា និងស្វាមី',
    message: 'រីករាយថ្ងៃមង្គលការប្អូនទាំងពីរ! សូមឱ្យជីវិតគូថ្មីនេះពោរពេញដោយស្នាមញញឹម ក្តីស្រឡាញ់ ការយល់ចិត្ត និងសុភមង្គលគ្រប់ពេលវេលា។',
    relationship: 'បងប្អូនជីដូនមួយ',
    timestamp: '៥ ម៉ោងមុន',
    likes: 12,
  },
  {
    id: 'w3',
    guestName: 'ក្រុមមិត្តភក្តិវិទ្យាល័យ និងសាកលវិទ្យាល័យ',
    message: 'អបអរសាទរមិត្តសម្លាញ់ វិចិត្រ & ចរិយា! ទីបំផុតបានក្លាយជាគូស្វាមីភរិយាពេញសិទ្ធិហើយ! ជួបគ្នាយប់ថ្ងៃអាទិត្យ ទី១៥ វិច្ឆិកា លើកកែវអបអរ!',
    relationship: 'មិត្តភក្តិជិតស្និទ្ធ',
    timestamp: '១ ថ្ងៃមុន',
    likes: 25,
  },
  {
    id: 'w4',
    guestName: 'លោកពូ សេង លាង និងអ្នកមីង',
    message: 'ពូ និងមីង សូមប្រសិទ្ធពរឱ្យក្មួយប្រុសស្រីទាំងពីរមានសុខភាពល្អបរិបូរណ៍ ឆាប់មានចៅៗឱ្យឪពុកម្តាយទាំងសងខាងបានបីត្រកង!',
    relationship: 'សាច់ញាតិខាងកូនប្រុស',
    timestamp: '២ ថ្ងៃមុន',
    likes: 15,
  },
];
