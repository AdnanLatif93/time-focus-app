// ─────────────────────────────────────────────────────────────────────────────
// FocusDay — Shared Types
// ─────────────────────────────────────────────────────────────────────────────

export type Category = 'jism' | 'rooh' | 'dimag' | 'ALL';

export type DayType =
  | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'
  | 'SAT' | 'SUN' | 'ALL';

export type BlockStatus = 'active' | 'upcoming' | 'done';

export interface Task {
  activity:  string;
  category:  Category;
  dayType:   DayType;
  note?:     string;
}

export interface SubWindow {
  label:     string;
  startTime: string;
  endTime:   string;
}

export interface TimeBlock {
  _id:                 string;
  blockName:           string;
  startTime:           string;   // '04:30'
  endTime:             string;   // '07:00'
  startMinutes:        number;
  endMinutes:          number;
  order:               number;
  reflectionQuestion?: string;
  tasks:               Task[];
  windows?:            SubWindow[];
}

// Block with runtime status — used in components
export interface Block extends TimeBlock {
  sheetName: string;
  status:    BlockStatus;
}

export interface UploadResponse {
  message: string;
  sheets:  Array<{
    id:        string;
    sheetName: string;
    rowCount:  number;
  }>;
}
