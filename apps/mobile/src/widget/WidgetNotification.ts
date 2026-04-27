/**
 * WidgetNotification — Persistent foreground-style notification
 * Uses @notifee/react-native
 *
 * Shows current active block as an ongoing notification:
 *   Title: "Morning Routine · Active"
 *   Body:  "wake up, miswak... · 37 min left"
 *   Ongoing: true (cannot be dismissed by user)
 */

import notifee, {
  AndroidImportance,
  AndroidColor,
  AndroidCategory,
} from '@notifee/react-native';
import { TimeBlock } from '@/types';

const CHANNEL_ID   = 'focusday_block';
const CHANNEL_NAME = 'Active Block';
const NOTIF_ID     = 'current_block';

// ── Create notification channel (call once on app start) ──────────────────────
export const createNotificationChannel = async (): Promise<void> => {
  await notifee.createChannel({
    id:          CHANNEL_ID,
    name:        CHANNEL_NAME,
    importance:  AndroidImportance.LOW,   // LOW = no sound, no heads-up
    lights:      false,
    vibration:   false,
  });
};

// ── Build notification body ───────────────────────────────────────────────────
const buildNotification = (block: TimeBlock, timeRemaining: number) => {
  const mainTask = block.tasks?.[0]?.activity ?? '';
  const body     = mainTask
    ? `${mainTask} · ${timeRemaining} min left`
    : `${timeRemaining} min left`;

  return {
    id:      NOTIF_ID,
    title:   `${block.blockName} · Active`,
    body,
    android: {
      channelId:    CHANNEL_ID,
      ongoing:      true,          // Cannot be dismissed
      onlyAlertOnce: true,         // No sound on updates
      category:     AndroidCategory.SERVICE,
      color:        AndroidColor.YELLOW,
      smallIcon:    'ic_notification', // Must exist in android/app/src/main/res/
      pressAction:  { id: 'default' }, // Opens app on tap
      progress: {
        max:     100,
        current: block.progressPercent ?? 0,
        indeterminate: false,
      },
    },
  };
};

// ── Public API ────────────────────────────────────────────────────────────────

export const startBlockNotification = async (
  block: TimeBlock,
  timeRemaining: number
): Promise<void> => {
  try {
    await createNotificationChannel();
    await notifee.displayNotification(buildNotification(block, timeRemaining));
  } catch (err) {
    console.warn('[WidgetNotification] start error:', err);
  }
};

export const updateBlockNotification = async (
  block: TimeBlock,
  timeRemaining: number
): Promise<void> => {
  try {
    // displayNotification with same id = update existing
    await notifee.displayNotification(buildNotification(block, timeRemaining));
  } catch (err) {
    console.warn('[WidgetNotification] update error:', err);
  }
};

export const stopBlockNotification = async (): Promise<void> => {
  try {
    await notifee.cancelNotification(NOTIF_ID);
  } catch (err) {
    console.warn('[WidgetNotification] stop error:', err);
  }
};
