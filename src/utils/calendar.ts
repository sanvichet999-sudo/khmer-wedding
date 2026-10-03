// Calendar link and .ics export generator for the wedding dinner party

export function getGoogleCalendarUrl(): string {
  const title = encodeURIComponent('ពិធីសិរីមង្គលអាពាហ៍ពិពាហ៍ & ពិធីជប់លៀងអាហារពេលល្ងាច | វិចិត្រ & ចរិយា');
  const details = encodeURIComponent(
    'សូមគោរពអញ្ជើញចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍ និងពិសាភោជនាហារពេលល្ងាច របស់កូនកំលោះ សុខ វិចិត្រ & កូនក្រមុំ ជា ចរិយា នៅអគារ G មជ្ឈមណ្ឌលកោះពេជ្រ រាជធានីភ្នំពេញ។'
  );
  const location = encodeURIComponent('Koh Pich Exhibition & Convention Center (Building G), Phnom Penh, Cambodia');
  
  // 2026-11-15 17:00:00 +07:00 is 2026-11-15 10:00:00 UTC
  // 2026-11-15 22:30:00 +07:00 is 2026-11-15 15:30:00 UTC
  const start = '20261115T100000Z';
  const end = '20261115T153000Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

export function downloadIcsFile(): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Khmer Wedding Invitation//KM',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:wedding-vichet-chariya-20261115@invitation.kh',
    'DTSTAMP:20261002T000000Z',
    'DTSTART:20261115T100000Z',
    'DTEND:20261115T153000Z',
    'SUMMARY:ពិធីសិរីមង្គលអាពាហ៍ពិពាហ៍ & ពិធីជប់លៀងអាហារពេលល្ងាច | វិចិត្រ & ចរិយា',
    'DESCRIPTION:សូមគោរពអញ្ជើញចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍ និងពិសាភោជនាហារពេលល្ងាច កូនកំលោះ សុខ វិចិត្រ & កូនក្រមុំ ជា ចរិយា',
    'LOCATION:Koh Pich Exhibition & Convention Center (Building G), Phnom Penh, Cambodia',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'vichet_chariya_wedding_invitation.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
