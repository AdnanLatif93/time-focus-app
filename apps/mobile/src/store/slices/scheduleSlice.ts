import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeBlock } from '@/types';

interface ScheduleState {
  blocks:          TimeBlock[];
  isLoaded:        boolean;
  lastUploadedAt:  string | null;
}

const initialState: ScheduleState = {
  blocks:         [],
  isLoaded:       false,
  lastUploadedAt: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setBlocks(state, action: PayloadAction<TimeBlock[]>) {
      state.blocks  = action.payload;
      state.isLoaded = true;
    },
    setLoaded(state, action: PayloadAction<boolean>) {
      state.isLoaded = action.payload;
    },
    setLastUploadedAt(state, action: PayloadAction<string>) {
      state.lastUploadedAt = action.payload;
    },
    clearSchedule(state) {
      state.blocks         = [];
      state.isLoaded       = false;
      state.lastUploadedAt = null;
    },
  },
});

export const { setBlocks, setLoaded, setLastUploadedAt, clearSchedule } =
  scheduleSlice.actions;

export default scheduleSlice.reducer;
