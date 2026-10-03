export interface WeddingScheduleItem {
  id: string;
  time: string;
  timeEnglish: string;
  titleKhmer: string;
  titleEnglish: string;
  descriptionKhmer: string;
  location: string;
  iconType: 'procession' | 'monk' | 'haircut' | 'lunch' | 'welcome' | 'dinner' | 'cake' | 'dance';
}

export interface GuestWish {
  id: string;
  guestName: string;
  message: string;
  relationship?: string;
  timestamp: string;
  likes: number;
}

export interface RsvpData {
  guestName: string;
  attendance: 'yes' | 'no';
  guestCount: number;
  dietaryPreference: 'standard' | 'vegetarian' | 'halal' | 'none';
  phoneOrTelegram: string;
  note: string;
  submittedAt: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  captionKhmer: string;
  captionEnglish: string;
  tag: string;
}
