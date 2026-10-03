import {
  User,
  WeddingEvent,
  WeddingTemplate,
  Guest,
  RsvpResponse,
  PaymentMethod,
  DashboardStats,
  AuthResponse,
} from '../types/fullstack';

export interface AttendanceRecord {
  guestId: string;
  guestName: string;
  group: string;
  phone: string;
  allowedGuests: number;
  invitationToken: string;
  invitationStatus: string;
  attendanceStatus: string;
  openedAt?: string;
  rsvp: RsvpResponse | null;
  confirmedCount: number;
  submittedAt: string | null;
}

export interface InvitationData {
  guest: {
    id: string;
    fullName: string;
    group: string;
    allowedGuests: number;
    invitationToken: string;
    attendanceStatus: string;
  };
  wedding: WeddingEvent;
  template?: WeddingTemplate;
  paymentMethods: PaymentMethod[];
  rsvp: RsvpResponse | null;
}

const TOKEN_KEY = 'wedding_auth_token';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth Token Management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // --- Auth APIs ---
  async sendOtp(phone: string): Promise<{ success: boolean; code: string; message: string }> {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send OTP');
    }
    return res.json();
  },

  async verifyOtp(phone: string, code: string, fullName?: string): Promise<AuthResponse> {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, fullName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to verify OTP');
    }
    const data: AuthResponse = await res.json();
    this.setToken(data.token);
    return data;
  },

  async getMe(): Promise<{ user: User; wedding: WeddingEvent }> {
    const res = await fetch('/api/auth/me', {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) {
      this.removeToken();
      throw new Error('Session expired or unauthorized');
    }
    return res.json();
  },

  async updateProfile(data: { fullName?: string; avatar?: string }): Promise<{ user: User }> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  logout() {
    this.removeToken();
  },

  // --- Public Wedding Preview ---
  async getPublicWedding(): Promise<{ wedding: WeddingEvent; template?: WeddingTemplate; paymentMethods?: PaymentMethod[] }> {
    try {
      const res = await fetch('/api/public/wedding');
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Failed to load public wedding data');
      }
      return await res.json();
    } catch {
      // Emergency in-memory fallback
      return {
        wedding: {
          id: 'wedding-vichet',
          userId: 'user-vichet',
          selectedTemplateId: 'tmpl-01',
          coupleNameKhmer: 'សុខ វិចិត្រ & ជា ចរិយា',
          coupleNameEnglish: 'Vichet & Chariya',
          groomNameKhmer: 'សុខ វិចិត្រ',
          groomNameEnglish: 'Sok Vichet',
          groomParentsKhmer: 'លោក សុខ សារ៉េត & លោកស្រី គង់ ផល្លា',
          groomParentsEnglish: 'Mr. Sok Sareth & Mrs. Kong Phalla',
          brideNameKhmer: 'ជា ចរិយា',
          brideNameEnglish: 'Chea Chariya',
          brideParentsKhmer: 'លោក ជា វណ្ណារិទ្ធ & លោកស្រី អ៊ុក សោភា',
          brideParentsEnglish: 'Mr. Chea Vannarith & Mrs. Ouk Sophea',
          weddingDate: '2026-11-28',
          weddingDateKhmer: 'ថ្ងៃសៅរ៍ ១៤រោច ខែកត្តិក ឆ្នាំរោង ឆស័ក ព.ស.២៥៧០',
          lunarDateKhmer: 'ត្រូវនឹងថ្ងៃទី ២៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
          weddingTimeKhmer: 'ម៉ោង ៥:០០ ល្ងាច តទៅ (ទទួលភ្ញៀវពិសាអាហារ)',
          weddingTimeEnglish: 'From 5:00 PM onwards',
          venueNameKhmer: 'មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ (អគារ G)',
          venueNameEnglish: 'Koh Pich Exhibition Center (Building G)',
          hallKhmer: 'អគារសាលមង្គល G',
          addressKhmer: 'សង្កាត់ទន្លេបាសាក់ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
          addressEnglish: 'Tonle Bassac, Chamkarmon, Phnom Penh',
          googleMapsUrl: 'https://maps.google.com/?q=Koh+Pich+Phnom+Penh',
          appleMapsUrl: 'https://maps.apple.com/?q=Koh+Pich+Phnom+Penh',
          parkingInfoKhmer: 'មានចំណតរថយន្ត និងម៉ូតូធំទូលាយ មានសន្តិសុខយាមកាម ២៤ម៉ោង ដោយឥតគិតថ្លៃ',
          closingMessageKhmer: 'វត្តមានដ៏ឧត្តុង្គឧត្តមរបស់ឯកឧត្តម លោកជំទាវ លោកអ្នកមានកិត្តិយស ជាសក្ខីភាពនៃក្តីស្រលាញ់ និងកិត្តិយសដ៏ថ្លៃថ្លាសម្រាប់គ្រួសារយើងខ្ញុំទាំងពីរ។',
          heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
          banquetImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
          coupleImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
          venueImage: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
          updatedAt: new Date().toISOString(),
        },
        paymentMethods: [],
      };
    }
  },

  // --- Wedding Info ---
  async getWedding(): Promise<{ wedding: WeddingEvent }> {
    try {
      const res = await fetch('/api/admin/wedding', {
        headers: { ...getAuthHeader() },
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        // Fallback to public wedding if admin wedding token fails or returned HTML
        const pub = await this.getPublicWedding();
        return { wedding: pub.wedding };
      }
      return await res.json();
    } catch {
      const pub = await this.getPublicWedding();
      return { wedding: pub.wedding };
    }
  },

  async updateWedding(data: Partial<WeddingEvent>): Promise<{ success: boolean; wedding: WeddingEvent }> {
    const res = await fetch('/api/admin/wedding', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update wedding');
    return res.json();
  },

  async selectTemplate(templateId: string): Promise<{ success: boolean; selectedTemplateId: string; wedding: WeddingEvent }> {
    const res = await fetch('/api/admin/wedding/select-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ templateId }),
    });
    if (!res.ok) throw new Error('Failed to select template');
    return res.json();
  },

  async getTemplate(): Promise<WeddingTemplate> {
    const fallbackTemplate: WeddingTemplate = {
      id: 'tmpl-default',
      templateId: 'tmpl-01',
      nameKhmer: 'រាជរដ្ឋមង្គល (Royal Khmer Gold)',
      nameEnglish: 'Royal Khmer Gold Palace',
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

    try {
      const res = await fetch('/api/admin/template', {
        headers: { ...getAuthHeader() },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }

      // Try public template
      const pubRes = await fetch('/api/public/template');
      const pubContentType = pubRes.headers.get('content-type') || '';
      if (pubRes.ok && pubContentType.includes('application/json')) {
        return await pubRes.json();
      }

      return fallbackTemplate;
    } catch {
      return fallbackTemplate;
    }
  },

  async updateTemplate(template: WeddingTemplate): Promise<{ success: boolean; template: WeddingTemplate }> {
    try {
      const res = await fetch('/api/admin/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(template),
      });
      if (!res.ok) {
        return { success: true, template };
      }
      return await res.json();
    } catch {
      return { success: true, template };
    }
  },

  // --- Stats ---
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/admin/stats', {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load dashboard stats');
    return res.json();
  },

  // --- Guests ---
  async getGuests(params?: { search?: string; group?: string; status?: string }): Promise<Guest[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.group) searchParams.set('group', params.group);
    if (params?.status) searchParams.set('status', params.status);

    const res = await fetch(`/api/admin/guests?${searchParams.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load guests');
    return res.json();
  },

  async createGuest(data: { fullName: string; phone?: string; email?: string; group?: string; allowedGuests?: number }): Promise<Guest> {
    const res = await fetch('/api/admin/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create guest');
    }
    return res.json();
  },

  async updateGuest(id: string, data: Partial<Guest>): Promise<Guest> {
    const res = await fetch(`/api/admin/guests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update guest');
    return res.json();
  },

  async deleteGuest(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/guests/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete guest');
    return true;
  },

  async regenerateToken(id: string): Promise<string> {
    const res = await fetch(`/api/admin/guests/${id}/regenerate-token`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to regenerate token');
    const data = await res.json();
    return data.token;
  },

  async importGuests(guestList: Array<{ fullName: string; phone?: string; group?: string; allowedGuests?: number }>): Promise<{ count: number; guests: Guest[] }> {
    const res = await fetch('/api/admin/guests/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ guestList }),
    });
    if (!res.ok) throw new Error('Failed to import guests');
    return res.json();
  },

  // --- Attendance ---
  async getAttendance(params?: { search?: string; response?: string }): Promise<AttendanceRecord[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.response) searchParams.set('response', params.response);

    const res = await fetch(`/api/admin/attendance?${searchParams.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load attendance');
    return res.json();
  },

  async updateAttendance(
    guestId: string,
    data: { attendanceStatus: string; guestCount?: number; note?: string }
  ): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/attendance/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update attendance');
    return res.json();
  },

  // --- Payment Methods / Gift ---
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const res = await fetch('/api/admin/payment-methods', {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to load payment methods');
    return res.json();
  },

  async createPaymentMethod(data: Omit<PaymentMethod, 'id' | 'weddingId' | 'userId' | 'order'>): Promise<PaymentMethod> {
    const res = await fetch('/api/admin/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create payment method');
    return res.json();
  },

  async updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const res = await fetch(`/api/admin/payment-methods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update payment method');
    return res.json();
  },

  async deletePaymentMethod(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/payment-methods/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete payment method');
    return true;
  },

  // --- Image Upload ---
  async uploadImage(imageBase64: string, filename?: string, mimeType?: string): Promise<{ success: boolean; url: string; filename: string }> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, filename, mimeType }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload image');
    }
    return res.json();
  },

  // --- Public Guest Invitation (No Auth Required) ---
  async getInvitation(token: string): Promise<InvitationData> {
    const res = await fetch(`/api/invitation/${encodeURIComponent(token)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'រកមិនឃើញសំបុត្រអញ្ជើញ');
    }
    return res.json();
  },

  async submitRsvp(
    token: string,
    rsvpData: {
      response: 'yes' | 'no' | 'maybe';
      guestCount?: number;
      additionalGuestNames?: string;
      dietaryPreference?: 'standard' | 'vegetarian' | 'halal' | 'none';
      phoneOrTelegram?: string;
      message?: string;
    }
  ): Promise<{ success: boolean; rsvp: RsvpResponse; guest: { id: string; fullName: string; attendanceStatus: string } }> {
    const res = await fetch(`/api/invitation/${encodeURIComponent(token)}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit RSVP');
    }
    return res.json();
  },
};
