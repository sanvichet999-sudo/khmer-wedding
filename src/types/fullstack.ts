export interface User {
  id: string;
  phone: string;
  fullName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingEvent {
  id: string;
  userId: string;
  selectedTemplateId: string; // 'tmpl-01' | 'tmpl-02' | 'tmpl-03' | 'tmpl-04' | 'tmpl-05' | 'tmpl-06'
  coupleNameKhmer: string;
  coupleNameEnglish: string;
  groomNameKhmer: string;
  groomNameEnglish: string;
  groomParentsKhmer: string;
  groomParentsEnglish: string;
  brideNameKhmer: string;
  brideNameEnglish: string;
  brideParentsKhmer: string;
  brideParentsEnglish: string;
  weddingDate: string; // ISO string
  weddingDateKhmer: string;
  lunarDateKhmer: string;
  weddingTimeKhmer: string;
  weddingTimeEnglish: string;
  venueNameKhmer: string;
  venueNameEnglish: string;
  hallKhmer: string;
  addressKhmer: string;
  addressEnglish: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
  parkingInfoKhmer: string;
  closingMessageKhmer: string;
  heroImage: string;
  banquetImage: string;
  coupleImage: string;
  venueImage: string;
  updatedAt: string;
}

export type InvitationStatus = 'pending' | 'sent' | 'opened';
export type AttendanceStatus = 'confirmed' | 'declined' | 'maybe' | 'not_responded';

export interface Guest {
  id: string;
  weddingId: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  group: string; // e.g. "VIP", "សាច់ញាតិខាងប្រុស", "សាច់ញាតិខាងស្រី", "មិត្តភក្តិ", "សហការី"
  allowedGuests: number;
  invitationToken: string;
  invitationStatus: InvitationStatus;
  attendanceStatus: AttendanceStatus;
  openedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RsvpResponse {
  id: string;
  guestId: string;
  guestName: string;
  response: 'yes' | 'no' | 'maybe';
  guestCount: number;
  additionalGuestNames?: string;
  dietaryPreference: 'standard' | 'vegetarian' | 'halal' | 'none';
  phoneOrTelegram?: string;
  message?: string;
  submittedAt: string;
}

export interface PaymentMethod {
  id: string;
  weddingId: string;
  userId: string;
  providerName: string;
  accountName: string;
  accountNumber: string;
  currency: 'USD' | 'KHR' | 'BOTH';
  qrImage: string;
  enabled: boolean;
  order: number;
}

export interface GuestWishItem {
  id: string;
  weddingId: string;
  guestName: string;
  message: string;
  relationship: string;
  timestamp: string;
  likes: number;
}

export interface TemplateSectionConfig {
  id: string;
  type: string;
  name: string;
  nameKhmer: string;
  titleKhmer?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface WeddingTemplate {
  id: string;
  templateId: 'tmpl-01' | 'tmpl-02' | 'tmpl-03' | 'tmpl-04' | 'tmpl-05' | 'tmpl-06';
  nameKhmer: string;
  nameEnglish: string;
  theme: {
    accentColor: string;
    primaryFont: string;
    displayFont: string;
    cardBg: string;
  };
  sections: TemplateSectionConfig[];
}

export interface TemplateDefinition {
  id: 'tmpl-01' | 'tmpl-02' | 'tmpl-03' | 'tmpl-04' | 'tmpl-05' | 'tmpl-06';
  nameKhmer: string;
  nameEnglish: string;
  subtitleKhmer: string;
  styleDescription: string;
  colorSchemeName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBg: string;
    text: string;
    textMuted: string;
  };
  fontDisplay: string;
  fontBody: string;
  previewThumbnail: string;
  tags: string[];
}

export interface DashboardStats {
  totalGuests: number;
  totalInvitationsSent: number;
  totalGuestsOpenedLink: number;
  totalConfirmed: number;
  totalDeclined: number;
  totalMaybe: number;
  totalNotResponded: number;
  totalExpectedAttendees: number;
  totalGiftsCount: number;
  selectedTemplateId: string;
  groupStats: { group: string; count: number; confirmed: number }[];
}

export interface AuthResponse {
  user: User;
  token: string;
  wedding: WeddingEvent;
}
