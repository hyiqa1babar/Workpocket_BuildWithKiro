// Natural-language date parsing for Smart Capture (rule-based).
// Extracts an ISO date string from freeform text phrases like
// "tomorrow", "Friday", "next Monday", "by Aug 5", "at 4pm today".
// Returns undefined when no date phrase is recognized.

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

function atMidnight(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function applyTime(date: Date, text: string): Date {
  // "at 4pm", "at 16:00", "4:30pm"
  const timeMatch = text.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridiem = timeMatch[3].toLowerCase();
    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    date.setHours(hour, minute, 0, 0);
    return date;
  }
  const time24 = text.match(/(?:at\s+)(\d{1,2}):(\d{2})/);
  if (time24) {
    date.setHours(parseInt(time24[1], 10), parseInt(time24[2], 10), 0, 0);
  }
  return date;
}

export function parseNaturalDate(input: string, now: Date = new Date()): string | undefined {
  const text = input.toLowerCase();

  // today / tonight
  if (/\b(today|tonight)\b/.test(text)) {
    return applyTime(atMidnight(now), text).toISOString();
  }

  // tomorrow
  if (/\btomorrow\b/.test(text)) {
    const d = atMidnight(now);
    d.setDate(d.getDate() + 1);
    return applyTime(d, text).toISOString();
  }

  // "in N days"
  const inDays = text.match(/\bin\s+(\d{1,3})\s+days?\b/);
  if (inDays) {
    const d = atMidnight(now);
    d.setDate(d.getDate() + parseInt(inDays[1], 10));
    return applyTime(d, text).toISOString();
  }

  // "next <weekday>" or "<weekday>" or "by <weekday>" or "before <weekday>"
  for (let i = 0; i < WEEKDAYS.length; i++) {
    const day = WEEKDAYS[i];
    const re = new RegExp('\\b(next\\s+)?' + day + '\\b');
    const m = text.match(re);
    if (m) {
      const isNext = Boolean(m[1]);
      const d = atMidnight(now);
      const currentDow = d.getDay();
      let delta = (i - currentDow + 7) % 7;
      if (delta === 0) delta = 7; // upcoming occurrence, not today
      if (isNext) delta += 0; // "next monday" == the coming monday here
      d.setDate(d.getDate() + delta);
      return applyTime(d, text).toISOString();
    }
  }

  // "Aug 5", "August 5", "5 Aug"
  const monthDay = text.match(
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})\b/
  );
  if (monthDay) {
    const monthIdx = MONTHS.indexOf(monthDay[1].slice(0, 3));
    const dayNum = parseInt(monthDay[2], 10);
    if (monthIdx >= 0 && dayNum >= 1 && dayNum <= 31) {
      let year = now.getFullYear();
      const candidate = new Date(year, monthIdx, dayNum);
      if (candidate < atMidnight(now)) {
        year += 1;
      }
      const d = new Date(year, monthIdx, dayNum);
      return applyTime(d, text).toISOString();
    }
  }

  // ISO-ish date "2026-09-12"
  const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    const d = new Date(
      parseInt(isoMatch[1], 10),
      parseInt(isoMatch[2], 10) - 1,
      parseInt(isoMatch[3], 10)
    );
    if (!isNaN(d.getTime())) return applyTime(d, text).toISOString();
  }

  return undefined;
}
