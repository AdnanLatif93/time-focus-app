/**
 * FocusDayWidget — Android Home Screen Widget
 * All react-native-android-widget imports are lazy
 * to prevent Metro crash when native module is not ready.
 */

import { CurrentBlockData, NextBlockData } from '@modules/current-block/api/currentBlockApi';

// ─── updateWidget — called by BlockTimer ─────────────────────────────────────
export const updateWidget = async (
  block:     CurrentBlockData | null,
  nextBlock: NextBlockData    | null
): Promise<void> => {
  try {
    const { requestWidgetUpdate } = await import('react-native-android-widget');
    const React = (await import('react')).default;
    const { FlexWidget, TextWidget } = await import('react-native-android-widget');

    const C = {
      bg:      '#181818',
      surface: '#222222',
      amber:   '#F5C347',
      white:   '#FFFFFF',
      muted:   '#888888',
      amberBg: '#3D2E00',
    };

    const WidgetUI = block
      ? React.createElement(
          FlexWidget,
          {
            style: { flex: 1, backgroundColor: C.bg, borderRadius: 16, padding: 14, flexDirection: 'column' },
            clickAction: 'OPEN_APP',
          },
          // Block name
          React.createElement(TextWidget, {
            text:  block.blockName,
            style: { color: C.white, fontSize: 16, fontWeight: 'bold' },
            maxLines: 1,
          }),
          // Time range
          React.createElement(TextWidget, {
            text:  `${block.startTime} – ${block.endTime}`,
            style: { color: C.muted, fontSize: 11, marginTop: 4 },
          }),
          // Top task
          block.todayTasks?.[0]
            ? React.createElement(TextWidget, {
                text:  `• ${block.todayTasks[0].activity}`,
                style: { color: C.muted, fontSize: 12, marginTop: 6 },
                maxLines: 1,
              })
            : null,
          // Time remaining
          React.createElement(
            FlexWidget,
            { style: { backgroundColor: C.amberBg, borderRadius: 8, padding: 8, marginTop: 8, alignItems: 'center' } },
            React.createElement(TextWidget, {
              text:  `${block.timeRemainingMinutes} min left`,
              style: { color: C.amber, fontSize: 14, fontWeight: 'bold' },
            })
          )
        )
      : React.createElement(
          FlexWidget,
          {
            style: { flex: 1, backgroundColor: C.bg, borderRadius: 16, padding: 16, justifyContent: 'center', alignItems: 'center' },
            clickAction: 'OPEN_APP',
          },
          React.createElement(TextWidget, {
            text:  'No active block',
            style: { color: C.muted, fontSize: 14 },
          })
        );

    await requestWidgetUpdate({
      widgetName:    'FocusDayWidget',
      renderWidget:  () => WidgetUI,
      if_not_exists: 'do_nothing',
    });
  } catch (err) {
    // Widget not installed or native module not ready — silently ignore
    console.warn('[FocusDayWidget] update skipped:', err);
  }
};
