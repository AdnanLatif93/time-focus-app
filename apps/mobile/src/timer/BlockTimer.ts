/**
 * BlockTimer — Singleton background timer
 * Every 60s: fetch current block → update Redux → update notification → update widget
 * All widget/notification imports are lazy to prevent startup crashes.
 */

import { store } from '@store/index';
import { setBlocks, setLastUploadedAt } from '@store/slices/scheduleSlice';

const TICK_INTERVAL_MS = 60_000;

class BlockTimerClass {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
    this.intervalId = setInterval(() => this.tick(), TICK_INTERVAL_MS);
    console.log('[BlockTimer] Started');
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    // Lazy stop notification
    import('@widget/WidgetNotification')
      .then(({ stopBlockNotification }) => stopBlockNotification())
      .catch(() => {});
    console.log('[BlockTimer] Stopped');
  }

  private async tick(): Promise<void> {
    try {
      const { getCurrentBlock } = await import('@modules/current-block/api/currentBlockApi');
      const { currentBlock, nextBlock } = await getCurrentBlock();

      if (currentBlock) {
        // 1. Update Redux
        store.dispatch(setBlocks([currentBlock]));
        store.dispatch(setLastUploadedAt(new Date().toISOString()));

        // 2. Update notification (lazy)
        try {
          const { updateBlockNotification } = await import('@widget/WidgetNotification');
          await updateBlockNotification(currentBlock, currentBlock.timeRemainingMinutes);
        } catch {}

        // 3. Update widget (lazy)
        try {
          const { updateWidget } = await import('@widget/FocusDayWidget');
          await updateWidget(currentBlock, nextBlock);
        } catch {}

      } else {
        try {
          const { stopBlockNotification } = await import('@widget/WidgetNotification');
          await stopBlockNotification();
        } catch {}

        try {
          const { updateWidget } = await import('@widget/FocusDayWidget');
          await updateWidget(null, nextBlock);
        } catch {}
      }
    } catch (err) {
      console.warn('[BlockTimer] tick error:', err);
    }
  }

  async refresh(): Promise<void> {
    await this.tick();
  }

  get running(): boolean {
    return this.isRunning;
  }
}

export const BlockTimer = new BlockTimerClass();
