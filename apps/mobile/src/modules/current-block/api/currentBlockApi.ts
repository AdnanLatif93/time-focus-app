import { api } from '@services/api';
import { TimeBlock, Task } from '@/types';

export interface CurrentBlockData extends TimeBlock {
  progressPercent:      number;
  timeRemainingMinutes: number;
  todayTasks:           Task[];
}

export interface NextBlockData {
  blockName:       string;
  startTime:       string;
  startsInMinutes: number;
}

export interface CurrentBlockResponse {
  success:      boolean;
  currentBlock: CurrentBlockData | null;
  nextBlock:    NextBlockData    | null;
}

export const getCurrentBlock = async (): Promise<CurrentBlockResponse> => {
  const [currentRes, nextRes] = await Promise.all([
    api.get('/blocks/current-block'),
    api.get('/blocks/next-block'),
  ]);

  const current: TimeBlock | null = currentRes?.data ?? null;
  const next:    TimeBlock | null = nextRes?.data    ?? null;

  // Compute derived fields client-side using blockTimeUtils
  const {
    getProgressPercent,
    getTimeRemaining,
    filterTasksForToday,
    timeToMinutes,
    nowInMinutes,
  } = await import('@timer/blockTimeUtils');

  let currentBlock: CurrentBlockData | null = null;

  if (current) {
    const startMins = current.startMinutes ?? timeToMinutes(current.startTime);
    const endMins   = current.endMinutes   ?? timeToMinutes(current.endTime);

    currentBlock = {
      ...current,
      startMinutes:         startMins,
      endMinutes:           endMins,
      order:                current.order ?? 0,
      progressPercent:      getProgressPercent(startMins, endMins),
      timeRemainingMinutes: getTimeRemaining(endMins),
      todayTasks:           filterTasksForToday(current.tasks ?? []),
    };
  }

  let nextBlock: NextBlockData | null = null;

  if (next) {
    const nextStartMins = next.startMinutes ?? timeToMinutes(next.startTime);
    nextBlock = {
      blockName:       next.blockName,
      startTime:       next.startTime,
      startsInMinutes: Math.max(0, nextStartMins - nowInMinutes()),
    };
  }

  return { success: true, currentBlock, nextBlock };
};
