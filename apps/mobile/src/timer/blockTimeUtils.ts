import { Task, DayType } from '@/types';

// ─── Time helpers ─────────────────────────────────────────────────────────────

/** Convert "HH:MM" string to total minutes since midnight */
export const timeToMinutes = (time: string): number => {
  const clean = String(time ?? '').trim();
  const [hh, mm] = clean.split(':').map(Number);
  if (isNaN(hh) || isNaN(mm)) return 0;
  return hh * 60 + mm;
};

/** Current time in minutes since midnight */
export const nowInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/** Format minutes-since-midnight back to "HH:MM" */
export const minutesToTime = (mins: number): string => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// ─── Day helpers ──────────────────────────────────────────────────────────────

const DAY_CODES: DayType[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** Returns current day code e.g. 'MON' */
export const getCurrentDayCode = (): DayType => {
  return DAY_CODES[new Date().getDay()];
};

/** Returns tasks that apply today:
 *  - dayType === 'ALL'  → always included
 *  - dayType === today  → included
 *  - anything else      → excluded
 */
export const filterTasksForToday = (tasks: Task[]): Task[] => {
  const today = getCurrentDayCode();
  return tasks.filter(
    (t) => t.dayType === 'ALL' || t.dayType === today
  );
};

// ─── Progress & time remaining ────────────────────────────────────────────────

/** 0–100 percent through a block based on current time */
export const getProgressPercent = (
  startMinutes: number,
  endMinutes:   number
): number => {
  const now      = nowInMinutes();
  const total    = endMinutes - startMinutes;
  if (total <= 0) return 100;
  const elapsed  = Math.max(0, now - startMinutes);
  return Math.min(100, Math.round((elapsed / total) * 100));
};

/** Minutes remaining until endMinutes */
export const getTimeRemaining = (endMinutes: number): number => {
  return Math.max(0, endMinutes - nowInMinutes());
};

/** Check if current time is within a block */
export const isBlockActive = (
  startMinutes: number,
  endMinutes:   number
): boolean => {
  const now = nowInMinutes();
  return now >= startMinutes && now < endMinutes;
};

/** Human-readable date string e.g. "Monday, 27 April" */
export const getTodayLabel = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
  });
};

/** Current time as "HH:MM" string */
export const getCurrentTimeString = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};
