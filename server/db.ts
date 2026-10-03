import fs from 'fs';
import path from 'path';
import {
  User,
  WeddingEvent,
  WeddingTemplate,
  Guest,
  RsvpResponse,
  PaymentMethod,
  GuestWishItem,
  DashboardStats,
} from '../src/types/fullstack';

interface DatabaseSchema {
  users: User[];
  otps: Record<string, { code: string; expiresAt: number; phone: string }>;
  sessions: Record<string, { userId: string; createdAt: number }>;
  weddings: WeddingEvent[];
  guests: Guest[];
  rsvps: RsvpResponse[];
  paymentMethods: PaymentMethod[];
  wishes: GuestWishItem[];
  templates?: Record<string, WeddingTemplate>;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'wedding_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateToken(prefix = 'khw'): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${res}`;
}

function generateSessionToken(): string {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

// Pre-seeded User A (សុខ វិចិត្រ)
const SEED_USER_A: User = {
  id: 'user-vichet',
  phone: '012888999',
  fullName: 'សុខ វិចិត្រ',
  avatar: '',
  createdAt: '2026-10-01T08:00:00.000Z',
  updatedAt: '2026-10-01T08:00:00.000Z',
};

const SEED_WEDDING_A: WeddingEvent = {
  id: 'wedding-vichet',
  userId: 'user-vichet',
  selectedTemplateId: 'tmpl-01', // Royal Khmer
  coupleNameKhmer: 'សុខ វិចិត្រ & ជា ចរិយា',
  coupleNameEnglish: 'Sok Vichet & Chea Chariya',
  groomNameKhmer: 'សុខ វិចិត្រ',
  groomNameEnglish: 'Sok Vichet',
  groomParentsKhmer: 'លោក សុខ ចិន្តា និង លោកស្រី អ៊ុំ សោភា',
  groomParentsEnglish: 'Mr. Sok Chenda & Mrs. Oum Sophea',
  brideNameKhmer: 'ជា ចរិយា',
  brideNameEnglish: 'Chea Chariya',
  brideParentsKhmer: 'លោក ជា ប៊ុនថន និង លោកស្រី ម៉ី វណ្ណា',
  brideParentsEnglish: 'Mr. Chea Bunthorn & Mrs. Mey Vanna',
  weddingDate: '2026-11-15T17:00:00+07:00',
  weddingDateKhmer: 'ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
  lunarDateKhmer: 'ត្រូវនឹង ថ្ងៃ ៧ កើត ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០',
  weddingTimeKhmer: 'វេលាម៉ោង ០៥:០០ នាទីល្ងាច',
  weddingTimeEnglish: 'From 5:00 PM onwards',
  venueNameKhmer: 'មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ (អគារ G)',
  venueNameEnglish: 'Koh Pich Exhibition & Convention Center (Building G)',
  hallKhmer: 'សាលមង្គល អគារ G (Diamond Island Grand Ballroom G)',
  addressKhmer: 'ផ្លូវកោះពេជ្រ សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
  addressEnglish: 'Koh Pich St., Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh, Cambodia',
  googleMapsUrl: 'https://maps.google.com/?q=Koh+Pich+Convention+Center+Phnom+Penh',
  appleMapsUrl: 'https://maps.apple.com/?q=Koh+Pich+Convention+Center+Phnom+Penh',
  parkingInfoKhmer: 'មានចំណតរថយន្ត និងទោចក្រយានយន្តយ៉ាងធំទូលាយ ព្រមទាំងមានបុគ្គលិកជួយសម្រួលការចតដោយឥតគិតថ្លៃ។',
  closingMessageKhmer: 'យើងខ្ញុំទាំងពីរនាក់ ព្រមទាំងមាតាបិតាទាំងសងខាង សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅបំផុត ចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តម និងសមានចិត្តដ៏ថ្លៃថ្លារបស់លោកអ្នក។',
  heroImage: '/src/assets/images/hero_khmer_wedding_1791004183585.jpg',
  banquetImage: '/src/assets/images/wedding_dinner_banquet_1791004202568.jpg',
  coupleImage: '/src/assets/images/khmer_prewedding_couple_1791004216374.jpg',
  venueImage: '/src/assets/images/wedding_venue_exterior_1791004229963.jpg',
  updatedAt: new Date().toISOString(),
};

const SEED_GUESTS_A: Guest[] = [
  {
    id: 'guest-v1',
    weddingId: 'wedding-vichet',
    userId: 'user-vichet',
    fullName: 'ឯកឧត្តម និងលោកជំទាវ ហួត សុភ័ក្រ',
    phone: '012 345 678',
    email: 'huot.sopheak@example.com',
    group: 'ភ្ញៀវកិត្តិយស (VIP)',
    allowedGuests: 2,
    invitationToken: 'khw-vip01',
    invitationStatus: 'opened',
    attendanceStatus: 'confirmed',
    openedAt: '2026-10-02T10:15:00.000Z',
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-02T10:20:00.000Z',
  },
  {
    id: 'guest-v2',
    weddingId: 'wedding-vichet',
    userId: 'user-vichet',
    fullName: 'លោកពូ សេង លាង និងអ្នកមីង',
    phone: '017 999 888',
    group: 'សាច់ញាតិខាងកូនប្រុស',
    allowedGuests: 3,
    invitationToken: 'khw-rel02',
    invitationStatus: 'opened',
    attendanceStatus: 'confirmed',
    openedAt: '2026-10-02T11:00:00.000Z',
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-02T11:05:00.000Z',
  },
  {
    id: 'guest-v3',
    weddingId: 'wedding-vichet',
    userId: 'user-vichet',
    fullName: 'បងស្រី រ័ត្ន ធីតា និងស្វាមី',
    phone: '098 777 666',
    group: 'សាច់ញាតិខាងកូនស្រី',
    allowedGuests: 2,
    invitationToken: 'khw-rel03',
    invitationStatus: 'sent',
    attendanceStatus: 'not_responded',
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
  },
];

const SEED_RSVPS_A: RsvpResponse[] = [
  {
    id: 'rsvp-v1',
    guestId: 'guest-v1',
    guestName: 'ឯកឧត្តម និងលោកជំទាវ ហួត សុភ័ក្រ',
    response: 'yes',
    guestCount: 2,
    additionalGuestNames: 'លោកជំទាវ ហួត សុភ័ក្រ',
    dietaryPreference: 'standard',
    phoneOrTelegram: '012 345 678',
    message: 'រីករាយថ្ងៃមង្គលការក្មួយទាំងពីរ! ជូនពរឱ្យមានសុភមង្គលពេញមួយជីវិត!',
    submittedAt: '2026-10-02T10:20:00.000Z',
  },
];

// Pre-seeded User B (កែវ ដារា) - Distinct Wedding B
const SEED_USER_B: User = {
  id: 'user-dara',
  phone: '016777888',
  fullName: 'កែវ ដារា',
  avatar: '',
  createdAt: '2026-10-01T09:00:00.000Z',
  updatedAt: '2026-10-01T09:00:00.000Z',
};

const SEED_WEDDING_B: WeddingEvent = {
  id: 'wedding-dara',
  userId: 'user-dara',
  selectedTemplateId: 'tmpl-02', // Modern Khmer
  coupleNameKhmer: 'កែវ ដារា & ម៉ី សុខា',
  coupleNameEnglish: 'Keo Dara & Mey Sokha',
  groomNameKhmer: 'កែវ ដារា',
  groomNameEnglish: 'Keo Dara',
  groomParentsKhmer: 'លោក កែវ វិបុល និង លោកស្រី គង់ សុភាព',
  groomParentsEnglish: 'Mr. Keo Vibul & Mrs. Kong Sopheap',
  brideNameKhmer: 'ម៉ី សុខា',
  brideNameEnglish: 'Mey Sokha',
  brideParentsKhmer: 'លោក ម៉ី សុផល និង លោកស្រី យី ម៉ាឡា',
  brideParentsEnglish: 'Mr. Mey Sophal & Mrs. Yi Mala',
  weddingDate: '2026-12-20T17:30:00+07:00',
  weddingDateKhmer: 'ថ្ងៃអាទិត្យ ទី២០ ខែធ្នូ ឆ្នាំ២០២៦',
  lunarDateKhmer: 'ត្រូវនឹង ថ្ងៃ ១២ កើត ខែមិគសិរ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០',
  weddingTimeKhmer: 'វេលាម៉ោង ០៥:៣០ នាទីល្ងាច',
  weddingTimeEnglish: 'From 5:30 PM onwards',
  venueNameKhmer: 'សណ្ឋាគារ ហ្គាដិន ស៊ីធី ភ្នំពេញ (Garden City Ballroom)',
  venueNameEnglish: 'Garden City Hotel & Ballroom, Phnom Penh',
  hallKhmer: 'សាលមហោស្រពធំ ហ្គាដិន ស៊ីធី',
  addressKhmer: 'ផ្លូវជាតិលេខ ៦A សង្កាត់បាក់ខែង ខណ្ឌជ្រោយចង្វារ រាជធានីភ្នំពេញ',
  addressEnglish: 'National Road 6A, Bak Kheng, Chroy Changvar, Phnom Penh',
  googleMapsUrl: 'https://maps.google.com/?q=Garden+City+Hotel+Phnom+Penh',
  appleMapsUrl: 'https://maps.apple.com/?q=Garden+City+Hotel+Phnom+Penh',
  parkingInfoKhmer: 'ចំណតរថយន្តធំទូលាយ មានសន្តិសុខយាមកាម ២៤ម៉ោង។',
  closingMessageKhmer: 'សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះវត្តមាន និងការជូនពរដ៏មានតម្លៃរបស់អ្នកទាំងអស់គ្នា!',
  heroImage: '/src/assets/images/khmer_prewedding_couple_1791004216374.jpg',
  banquetImage: '/src/assets/images/wedding_dinner_banquet_1791004202568.jpg',
  coupleImage: '/src/assets/images/hero_khmer_wedding_1791004183585.jpg',
  venueImage: '/src/assets/images/wedding_venue_exterior_1791004229963.jpg',
  updatedAt: new Date().toISOString(),
};

const SEED_GUESTS_B: Guest[] = [
  {
    id: 'guest-d1',
    weddingId: 'wedding-dara',
    userId: 'user-dara',
    fullName: 'លោក ចាន់ ពិសិដ្ឋ និងភរិយា',
    phone: '085 111 222',
    group: 'មិត្តភក្តិជិតស្និទ្ធ',
    allowedGuests: 2,
    invitationToken: 'khw-dara01',
    invitationStatus: 'sent',
    attendanceStatus: 'confirmed',
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z',
  },
];

class MultiTenantWeddingDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.users) && Array.isArray(parsed.weddings)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading db file, re-initializing default schema:', err);
    }

    const initialData: DatabaseSchema = {
      users: [SEED_USER_A, SEED_USER_B],
      otps: {},
      sessions: {
        'sess_seed_vichet': { userId: 'user-vichet', createdAt: Date.now() },
        'sess_seed_dara': { userId: 'user-dara', createdAt: Date.now() },
      },
      weddings: [SEED_WEDDING_A, SEED_WEDDING_B],
      guests: [...SEED_GUESTS_A, ...SEED_GUESTS_B],
      rsvps: [...SEED_RSVPS_A],
      paymentMethods: [
        {
          id: 'pay-v1',
          weddingId: 'wedding-vichet',
          userId: 'user-vichet',
          providerName: 'ABA Bank',
          accountName: 'SOK VICHET & CHEA CHARIYA',
          accountNumber: '001 888 999',
          currency: 'USD',
          qrImage: '',
          enabled: true,
          order: 1,
        },
        {
          id: 'pay-v2',
          weddingId: 'wedding-vichet',
          userId: 'user-vichet',
          providerName: 'ACLEDA Bank',
          accountName: 'SOK VICHET',
          accountNumber: '010-888-777-66',
          currency: 'KHR',
          qrImage: '',
          enabled: true,
          order: 2,
        },
        {
          id: 'pay-d1',
          weddingId: 'wedding-dara',
          userId: 'user-dara',
          providerName: 'ABA Bank',
          accountName: 'KEO DARA',
          accountNumber: '002 999 777',
          currency: 'USD',
          qrImage: '',
          enabled: true,
          order: 1,
        },
      ],
      wishes: [
        {
          id: 'w1',
          weddingId: 'wedding-vichet',
          guestName: 'ឯកឧត្តម និងលោកជំទាវ ហួត សុភ័ក្រ',
          message: 'សូមប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខ មហាប្រសើរ ជូនដល់ក្មួយទាំងពីរ!',
          relationship: 'ភ្ញៀវកិត្តិយស (VIP)',
          timestamp: '២ ម៉ោងមុន',
          likes: 18,
        },
      ],
    };
    this.save(initialData);
    return initialData;
  }

  private save(data = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving wedding db:', err);
    }
  }

  // --- Authentication & OTP ---
  sendOtp(phone: string): { success: boolean; code: string; message: string } {
    const cleanPhone = phone.replace(/[\s-+]/g, '');
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    this.data.otps[cleanPhone] = { code, expiresAt, phone: cleanPhone };
    this.save();

    return {
      success: true,
      code, // returned so the client can auto-fill or simulate SMS delivery seamlessly
      message: `លេខកូដផ្ទៀងផ្ទាត់ OTP ត្រូវបានផ្ញើទៅកាន់ ${phone}។ (កូដ: ${code})`,
    };
  }

  verifyOtp(phone: string, code: string, fullName?: string): { user: User; token: string; wedding: WeddingEvent } | { error: string } {
    const cleanPhone = phone.replace(/[\s-+]/g, '');
    const record = this.data.otps[cleanPhone];

    // For ease of testing, allow predefined default seed accounts or verified OTP
    const isSpecialSeed = (cleanPhone === '012888999' || cleanPhone === '016777888');
    if (!isSpecialSeed) {
      if (!record) {
        return { error: 'លេខទូរស័ព្ទនេះមិនទាន់បានស្នើសុំលេខកូដ OTP ទេ។' };
      }
      if (record.code !== code.trim()) {
        return { error: 'លេខកូដ OTP មិនត្រឹមត្រូវទេ។ សូមពិនិត្យម្តងទៀត។' };
      }
      if (Date.now() > record.expiresAt) {
        return { error: 'លេខកូដ OTP នេះបានផុតកំណត់ហើយ។ សូមស្នើសុំកូដថ្មី។' };
      }
    }

    // Clean up OTP record
    delete this.data.otps[cleanPhone];

    let user = this.data.users.find((u) => u.phone === cleanPhone);
    let wedding: WeddingEvent;

    if (!user) {
      // Create new user account
      const userId = 'user-' + Date.now();
      const defaultName = fullName && fullName.trim() ? fullName.trim() : `អ្នកប្រើប្រាស់ ${cleanPhone.slice(-4)}`;
      user = {
        id: userId,
        phone: cleanPhone,
        fullName: defaultName,
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.users.push(user);

      // Create initial wedding event for this user
      wedding = {
        id: 'wedding-' + Date.now(),
        userId: userId,
        selectedTemplateId: 'tmpl-01',
        coupleNameKhmer: `${user.fullName} & គូដណ្តឹង`,
        coupleNameEnglish: 'Groom & Bride',
        groomNameKhmer: user.fullName,
        groomNameEnglish: 'Groom',
        groomParentsKhmer: 'លោកឪពុក និង អ្នកម្តាយខាងប្រុស',
        groomParentsEnglish: 'Parents of the Groom',
        brideNameKhmer: 'គូដណ្តឹង',
        brideNameEnglish: 'Bride',
        brideParentsKhmer: 'លោកឪពុក និង អ្នកម្តាយខាងស្រី',
        brideParentsEnglish: 'Parents of the Bride',
        weddingDate: '2026-11-28T17:00:00+07:00',
        weddingDateKhmer: 'ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
        lunarDateKhmer: 'ត្រូវនឹង ថ្ងៃ ២០ កើត ខែកត្តិក ឆ្នាំមមី',
        weddingTimeKhmer: 'វេលាម៉ោង ០៥:០០ នាទីល្ងាច',
        weddingTimeEnglish: 'From 5:00 PM onwards',
        venueNameKhmer: 'មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ (អគារ G)',
        venueNameEnglish: 'Koh Pich Exhibition & Convention Center',
        hallKhmer: 'សាលមង្គល អគារ G',
        addressKhmer: 'ផ្លូវកោះពេជ្រ សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
        addressEnglish: 'Koh Pich St., Phnom Penh, Cambodia',
        googleMapsUrl: 'https://maps.google.com/?q=Koh+Pich+Phnom+Penh',
        appleMapsUrl: 'https://maps.apple.com/?q=Koh+Pich+Phnom+Penh',
        parkingInfoKhmer: 'មានចំណតរថយន្ត និងទោចក្រយានយន្តយ៉ាងធំទូលាយ។',
        closingMessageKhmer: 'សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅបំផុត ចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តមរបស់លោកអ្នក។',
        heroImage: '/src/assets/images/hero_khmer_wedding_1791004183585.jpg',
        banquetImage: '/src/assets/images/wedding_dinner_banquet_1791004202568.jpg',
        coupleImage: '/src/assets/images/khmer_prewedding_couple_1791004216374.jpg',
        venueImage: '/src/assets/images/wedding_venue_exterior_1791004229963.jpg',
        updatedAt: new Date().toISOString(),
      };
      this.data.weddings.push(wedding);
    } else {
      wedding = this.data.weddings.find((w) => w.userId === user!.id) || this.createWeddingForUser(user.id);
    }

    const sessionToken = generateSessionToken();
    this.data.sessions[sessionToken] = { userId: user.id, createdAt: Date.now() };
    this.save();

    return { user, token: sessionToken, wedding };
  }

  getUserBySession(token: string): User | null {
    if (!token) return null;
    const sess = this.data.sessions[token];
    if (!sess) return null;
    return this.data.users.find((u) => u.id === sess.userId) || null;
  }

  updateUserProfile(userId: string, partial: { fullName?: string; avatar?: string }): User | null {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return null;
    if (partial.fullName) user.fullName = partial.fullName.trim();
    if (partial.avatar !== undefined) user.avatar = partial.avatar;
    user.updatedAt = new Date().toISOString();
    this.save();
    return user;
  }

  // --- Multi-Tenant Wedding Management ---
  createWeddingForUser(userId: string): WeddingEvent {
    const user = this.data.users.find((u) => u.id === userId);
    const newWedding: WeddingEvent = {
      id: 'wedding-' + Date.now(),
      userId,
      selectedTemplateId: 'tmpl-01',
      coupleNameKhmer: user ? `${user.fullName} & គូដណ្តឹង` : 'កូនកំលោះ & កូនក្រមុំ',
      coupleNameEnglish: 'Groom & Bride',
      groomNameKhmer: user ? user.fullName : 'កូនកំលោះ',
      groomNameEnglish: 'Groom',
      groomParentsKhmer: 'លោកឪពុក និង អ្នកម្តាយខាងប្រុស',
      groomParentsEnglish: 'Parents of the Groom',
      brideNameKhmer: 'កូនក្រមុំ',
      brideNameEnglish: 'Bride',
      brideParentsKhmer: 'លោកឪពុក និង អ្នកម្តាយខាងស្រី',
      brideParentsEnglish: 'Parents of the Bride',
      weddingDate: '2026-11-28T17:00:00+07:00',
      weddingDateKhmer: 'ថ្ងៃសៅរ៍ ទី២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
      lunarDateKhmer: 'ត្រូវនឹង ថ្ងៃ ២០ កើត ខែកត្តិក ឆ្នាំមមី',
      weddingTimeKhmer: 'វេលាម៉ោង ០៥:០០ នាទីល្ងាច',
      weddingTimeEnglish: 'From 5:00 PM onwards',
      venueNameKhmer: 'មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ',
      venueNameEnglish: 'Koh Pich Exhibition Center',
      hallKhmer: 'សាលមង្គល អគារ G',
      addressKhmer: 'ផ្លូវកោះពេជ្រ រាជធានីភ្នំពេញ',
      addressEnglish: 'Koh Pich St., Phnom Penh',
      googleMapsUrl: 'https://maps.google.com/?q=Koh+Pich+Phnom+Penh',
      appleMapsUrl: 'https://maps.apple.com/?q=Koh+Pich+Phnom+Penh',
      parkingInfoKhmer: 'មានចំណតរថយន្ត និងទោចក្រយានយន្តយ៉ាងធំទូលាយ។',
      closingMessageKhmer: 'សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅបំផុត ចំពោះវត្តមានដ៏ឧត្តុង្គឧត្តមរបស់លោកអ្នក។',
      heroImage: '/src/assets/images/hero_khmer_wedding_1791004183585.jpg',
      banquetImage: '/src/assets/images/wedding_dinner_banquet_1791004202568.jpg',
      coupleImage: '/src/assets/images/khmer_prewedding_couple_1791004216374.jpg',
      venueImage: '/src/assets/images/wedding_venue_exterior_1791004229963.jpg',
      updatedAt: new Date().toISOString(),
    };
    this.data.weddings.push(newWedding);
    this.save();
    return newWedding;
  }

  getWeddingByUserId(userId: string): WeddingEvent {
    let w = this.data.weddings.find((item) => item.userId === userId);
    if (!w) {
      w = this.createWeddingForUser(userId);
    }
    return w;
  }

  updateWeddingForUser(userId: string, partial: Partial<WeddingEvent>): WeddingEvent {
    const w = this.getWeddingByUserId(userId);
    Object.assign(w, partial, { updatedAt: new Date().toISOString() });
    this.save();
    return w;
  }

  selectTemplateForUser(userId: string, templateId: string): WeddingEvent {
    const w = this.getWeddingByUserId(userId);
    w.selectedTemplateId = templateId;
    w.updatedAt = new Date().toISOString();
    
    // Also sync with user template if present
    if (this.data.templates && this.data.templates[userId]) {
      this.data.templates[userId].templateId = templateId as any;
    }
    
    this.save();
    return w;
  }

  getTemplateByUserId(userId: string): WeddingTemplate {
    if (!this.data.templates) this.data.templates = {};
    if (this.data.templates[userId]) {
      return this.data.templates[userId];
    }

    const wedding = this.getWeddingByUserId(userId);
    const defaultTemplate: WeddingTemplate = {
      id: `tmpl-${userId}`,
      templateId: (wedding.selectedTemplateId as any) || 'tmpl-01',
      nameKhmer: 'រាជរាជមង្គល (Royal Khmer Gold)',
      nameEnglish: 'Royal Khmer Gold',
      theme: {
        accentColor: '#d97706',
        primaryFont: 'font-kantumruy',
        displayFont: 'font-moul',
        cardBg: '#141210',
      },
      sections: [
        { id: 'sec-hero', type: 'hero', name: 'Hero Banner', nameKhmer: 'ទំព័រដើម & ឈ្មោះគូស្នេហ៍', titleKhmer: 'ទំព័រដើម & ឈ្មោះគូស្នេហ៍', enabled: true, sortOrder: 1 },
        { id: 'sec-couple', type: 'couple', name: 'Parents & Blessings', nameKhmer: 'មាតាបិតាទាំងសងខាង', titleKhmer: 'មាតាបិតាទាំងសងខាង', enabled: true, sortOrder: 2 },
        { id: 'sec-schedule', type: 'schedule', name: 'Timeline Schedule', nameKhmer: 'កាលវិភាគពិធីមង្គលការ', titleKhmer: 'កាលវិភាគពិធីមង្គលការ', enabled: true, sortOrder: 3 },
        { id: 'sec-venue', type: 'venue', name: 'Venue & Directions', nameKhmer: 'ទីតាំង & ផែនទី', titleKhmer: 'ទីតាំង & ផែនទី', enabled: true, sortOrder: 4 },
        { id: 'sec-gallery', type: 'gallery', name: 'Photo Gallery', nameKhmer: 'រូបថត Pre-wedding', titleKhmer: 'រូបថត Pre-wedding', enabled: true, sortOrder: 5 },
        { id: 'sec-dress', type: 'dressCode', name: 'Dress Code', nameKhmer: 'ពណ៌សម្លៀកបំពាក់', titleKhmer: 'ពណ៌សម្លៀកបំពាក់', enabled: true, sortOrder: 6 },
        { id: 'sec-rsvp', type: 'rsvp', name: 'RSVP Form', nameKhmer: 'បញ្ជាក់វត្តមាន RSVP', titleKhmer: 'បញ្ជាក់វត្តមាន RSVP', enabled: true, sortOrder: 7 },
        { id: 'sec-guestbook', type: 'guestbook', name: 'Guest Wishes', nameKhmer: 'សៀវភៅជូនពរឌីជីថល', titleKhmer: 'សៀវភៅជូនពរឌីជីថល', enabled: true, sortOrder: 8 },
        { id: 'sec-gift', type: 'gift', name: 'Gift Envelope / KHQR', nameKhmer: 'ចងដៃឌីជីថល KHQR', titleKhmer: 'ចងដៃឌីជីថល KHQR', enabled: true, sortOrder: 9 },
        { id: 'sec-closing', type: 'closing', name: 'Thank You Message', nameKhmer: 'សារថ្លែងអំណរគុណ', titleKhmer: 'សារថ្លែងអំណរគុណ', enabled: true, sortOrder: 10 },
      ],
    };

    this.data.templates[userId] = defaultTemplate;
    this.save();
    return defaultTemplate;
  }

  updateTemplateForUser(userId: string, template: WeddingTemplate): WeddingTemplate {
    if (!this.data.templates) this.data.templates = {};
    this.data.templates[userId] = template;
    this.save();
    return template;
  }

  // --- Multi-Tenant Guests ---
  getGuestsByUserId(userId: string, filters?: { search?: string; group?: string; status?: string }): Guest[] {
    let list = this.data.guests.filter((g) => g.userId === userId);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (g) =>
          g.fullName.toLowerCase().includes(q) ||
          g.phone.includes(q) ||
          g.invitationToken.toLowerCase().includes(q)
      );
    }

    if (filters?.group && filters.group !== 'all') {
      list = list.filter((g) => g.group === filters.group);
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((g) => g.attendanceStatus === filters.status);
    }

    return list;
  }

  createGuestForUser(userId: string, data: { fullName: string; phone?: string; email?: string; group?: string; allowedGuests?: number }): Guest {
    const wedding = this.getWeddingByUserId(userId);
    const newGuest: Guest = {
      id: 'guest-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      weddingId: wedding.id,
      userId,
      fullName: data.fullName.trim(),
      phone: data.phone?.trim() || '',
      email: data.email?.trim() || '',
      group: data.group?.trim() || 'ភ្ញៀវទូទៅ',
      allowedGuests: Math.max(1, data.allowedGuests || 1),
      invitationToken: generateToken(),
      invitationStatus: 'pending',
      attendanceStatus: 'not_responded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.guests.push(newGuest);
    this.save();
    return newGuest;
  }

  updateGuestForUser(userId: string, guestId: string, partial: Partial<Guest>): Guest | null {
    const guest = this.data.guests.find((g) => g.id === guestId && g.userId === userId);
    if (!guest) return null;
    Object.assign(guest, partial, { updatedAt: new Date().toISOString() });
    this.save();
    return guest;
  }

  deleteGuestForUser(userId: string, guestId: string): boolean {
    const prevLen = this.data.guests.length;
    this.data.guests = this.data.guests.filter((g) => !(g.id === guestId && g.userId === userId));
    this.data.rsvps = this.data.rsvps.filter((r) => r.guestId !== guestId);
    this.save();
    return this.data.guests.length < prevLen;
  }

  regenerateGuestToken(userId: string, guestId: string): string | null {
    const guest = this.data.guests.find((g) => g.id === guestId && g.userId === userId);
    if (!guest) return null;
    const newToken = generateToken();
    guest.invitationToken = newToken;
    guest.updatedAt = new Date().toISOString();
    this.save();
    return newToken;
  }

  importGuestsForUser(userId: string, list: Array<{ fullName: string; phone?: string; group?: string; allowedGuests?: number }>): Guest[] {
    const created: Guest[] = [];
    for (const item of list) {
      if (item.fullName && item.fullName.trim()) {
        const g = this.createGuestForUser(userId, {
          fullName: item.fullName,
          phone: item.phone,
          group: item.group,
          allowedGuests: item.allowedGuests,
        });
        created.push(g);
      }
    }
    return created;
  }

  // --- Multi-Tenant Attendance ---
  getAttendanceByUserId(userId: string, filters?: { search?: string; response?: string }) {
    const guests = this.getGuestsByUserId(userId);
    const rsvps = this.data.rsvps;

    let records = guests.map((g) => {
      const rsvp = rsvps.find((r) => r.guestId === g.id);
      return {
        guestId: g.id,
        guestName: g.fullName,
        group: g.group,
        phone: g.phone,
        allowedGuests: g.allowedGuests,
        invitationToken: g.invitationToken,
        invitationStatus: g.invitationStatus,
        attendanceStatus: g.attendanceStatus,
        openedAt: g.openedAt,
        rsvp: rsvp || null,
        confirmedCount: rsvp && rsvp.response === 'yes' ? rsvp.guestCount : 0,
        submittedAt: rsvp ? rsvp.submittedAt : null,
      };
    });

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter((r) => r.guestName.toLowerCase().includes(q) || r.phone.includes(q));
    }

    if (filters?.response && filters.response !== 'all') {
      records = records.filter((r) => r.attendanceStatus === filters.response);
    }

    return records;
  }

  updateAttendanceForUser(userId: string, guestId: string, data: { attendanceStatus: string; guestCount?: number; note?: string }): boolean {
    const guest = this.data.guests.find((g) => g.id === guestId && g.userId === userId);
    if (!guest) return false;

    guest.attendanceStatus = data.attendanceStatus as any;
    guest.updatedAt = new Date().toISOString();

    let rsvp = this.data.rsvps.find((r) => r.guestId === guestId);
    if (rsvp) {
      if (data.guestCount !== undefined) rsvp.guestCount = data.guestCount;
      if (data.note) rsvp.message = data.note;
    } else if (data.guestCount) {
      this.data.rsvps.push({
        id: 'rsvp-' + Date.now(),
        guestId,
        guestName: guest.fullName,
        response: data.attendanceStatus === 'confirmed' ? 'yes' : data.attendanceStatus === 'declined' ? 'no' : 'maybe',
        guestCount: data.guestCount,
        submittedAt: new Date().toISOString(),
        message: data.note || '',
        dietaryPreference: 'standard',
      });
    }

    this.save();
    return true;
  }

  // --- Multi-Tenant Payment Methods ---
  getPaymentMethodsByUserId(userId: string): PaymentMethod[] {
    return this.data.paymentMethods.filter((p) => p.userId === userId).sort((a, b) => a.order - b.order);
  }

  createPaymentMethodForUser(userId: string, data: Omit<PaymentMethod, 'id' | 'weddingId' | 'userId' | 'order'>): PaymentMethod {
    const wedding = this.getWeddingByUserId(userId);
    const existing = this.getPaymentMethodsByUserId(userId);
    const newMethod: PaymentMethod = {
      id: 'pay-' + Date.now(),
      weddingId: wedding.id,
      userId,
      ...data,
      order: existing.length + 1,
    };
    this.data.paymentMethods.push(newMethod);
    this.save();
    return newMethod;
  }

  updatePaymentMethodForUser(userId: string, id: string, partial: Partial<PaymentMethod>): PaymentMethod | null {
    const method = this.data.paymentMethods.find((p) => p.id === id && p.userId === userId);
    if (!method) return null;
    Object.assign(method, partial);
    this.save();
    return method;
  }

  deletePaymentMethodForUser(userId: string, id: string): boolean {
    const prev = this.data.paymentMethods.length;
    this.data.paymentMethods = this.data.paymentMethods.filter((p) => !(p.id === id && p.userId === userId));
    this.save();
    return this.data.paymentMethods.length < prev;
  }

  // --- Multi-Tenant Statistics ---
  getStatsByUserId(userId: string): DashboardStats {
    const wedding = this.getWeddingByUserId(userId);
    const guests = this.data.guests.filter((g) => g.userId === userId);
    const rsvps = this.data.rsvps.filter((r) => guests.some((g) => g.id === r.guestId));

    const totalGuests = guests.length;
    const totalInvitationsSent = guests.filter((g) => g.invitationStatus === 'sent' || g.invitationStatus === 'opened').length;
    const totalGuestsOpenedLink = guests.filter((g) => g.invitationStatus === 'opened').length;
    const totalConfirmed = guests.filter((g) => g.attendanceStatus === 'confirmed').length;
    const totalDeclined = guests.filter((g) => g.attendanceStatus === 'declined').length;
    const totalMaybe = guests.filter((g) => g.attendanceStatus === 'maybe').length;
    const totalNotResponded = guests.filter((g) => g.attendanceStatus === 'not_responded').length;

    const totalExpectedAttendees = rsvps
      .filter((r) => r.response === 'yes')
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);

    const groupMap: Record<string, { count: number; confirmed: number }> = {};
    for (const g of guests) {
      if (!groupMap[g.group]) groupMap[g.group] = { count: 0, confirmed: 0 };
      groupMap[g.group].count++;
      if (g.attendanceStatus === 'confirmed') groupMap[g.group].confirmed++;
    }

    const groupStats = Object.keys(groupMap).map((k) => ({
      group: k,
      count: groupMap[k].count,
      confirmed: groupMap[k].confirmed,
    }));

    const paymentMethods = this.data.paymentMethods.filter((p) => p.userId === userId && p.enabled);

    return {
      totalGuests,
      totalInvitationsSent,
      totalGuestsOpenedLink,
      totalConfirmed,
      totalDeclined,
      totalMaybe,
      totalNotResponded,
      totalExpectedAttendees,
      totalGiftsCount: paymentMethods.length,
      selectedTemplateId: wedding.selectedTemplateId || 'tmpl-01',
      groupStats,
    };
  }

  // --- Public Guest Invitation Access by Token ---
  getInvitationByToken(token: string): {
    guest: Guest;
    wedding: WeddingEvent;
    template: WeddingTemplate;
    paymentMethods: PaymentMethod[];
    rsvp: RsvpResponse | null;
  } | null {
    const cleanToken = token.trim().toLowerCase();
    const guest = this.data.guests.find((g) => g.invitationToken.toLowerCase() === cleanToken);
    if (!guest) return null;

    // Mark as opened
    if (guest.invitationStatus === 'pending' || guest.invitationStatus === 'sent') {
      guest.invitationStatus = 'opened';
      guest.openedAt = new Date().toISOString();
      guest.updatedAt = new Date().toISOString();
      this.save();
    }

    const wedding = this.data.weddings.find((w) => w.id === guest.weddingId) || this.data.weddings[0];
    const template = this.getTemplateByUserId(guest.userId);
    const paymentMethods = this.data.paymentMethods.filter((p) => p.weddingId === guest.weddingId && p.enabled);
    const rsvp = this.data.rsvps.find((r) => r.guestId === guest.id) || null;

    return {
      guest,
      wedding,
      template,
      paymentMethods,
      rsvp,
    };
  }

  submitRsvpByToken(
    token: string,
    rsvpData: {
      response: 'yes' | 'no' | 'maybe';
      guestCount?: number;
      additionalGuestNames?: string;
      dietaryPreference?: 'standard' | 'vegetarian' | 'halal' | 'none';
      phoneOrTelegram?: string;
      message?: string;
    }
  ): { rsvp: RsvpResponse; guest: Guest } | { error: string } {
    const cleanToken = token.trim().toLowerCase();
    const guest = this.data.guests.find((g) => g.invitationToken.toLowerCase() === cleanToken);
    if (!guest) return { error: 'រកមិនឃើញទិន្នន័យភ្ញៀវតាមតំណភ្ជាប់នេះទេ។' };

    // Enforce allowedGuests limit strictly
    const count = rsvpData.response === 'yes' ? Math.min(Math.max(1, rsvpData.guestCount || 1), guest.allowedGuests) : 0;

    let rsvp = this.data.rsvps.find((r) => r.guestId === guest.id);
    if (rsvp) {
      rsvp.response = rsvpData.response;
      rsvp.guestCount = count;
      rsvp.additionalGuestNames = rsvpData.additionalGuestNames || '';
      rsvp.dietaryPreference = rsvpData.dietaryPreference || 'standard';
      rsvp.phoneOrTelegram = rsvpData.phoneOrTelegram || guest.phone;
      rsvp.message = rsvpData.message || '';
      rsvp.submittedAt = new Date().toISOString();
    } else {
      rsvp = {
        id: 'rsvp-' + Date.now(),
        guestId: guest.id,
        guestName: guest.fullName,
        response: rsvpData.response,
        guestCount: count,
        additionalGuestNames: rsvpData.additionalGuestNames || '',
        dietaryPreference: rsvpData.dietaryPreference || 'standard',
        phoneOrTelegram: rsvpData.phoneOrTelegram || guest.phone,
        message: rsvpData.message || '',
        submittedAt: new Date().toISOString(),
      };
      this.data.rsvps.push(rsvp);
    }

    if (rsvpData.response === 'yes') {
      guest.attendanceStatus = 'confirmed';
    } else if (rsvpData.response === 'no') {
      guest.attendanceStatus = 'declined';
    } else {
      guest.attendanceStatus = 'maybe';
    }
    guest.invitationStatus = 'opened';
    guest.updatedAt = new Date().toISOString();

    if (rsvpData.message && rsvpData.message.trim()) {
      this.data.wishes.unshift({
        id: 'w_' + Date.now(),
        weddingId: guest.weddingId,
        guestName: guest.fullName,
        message: rsvpData.message.trim(),
        relationship: guest.group,
        timestamp: 'ទើបតែសរសេរ',
        likes: 1,
      });
    }

    this.save();
    return { rsvp, guest };
  }
}

export const db = new MultiTenantWeddingDatabase();
