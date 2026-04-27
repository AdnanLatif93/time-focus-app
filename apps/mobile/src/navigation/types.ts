// ─────────────────────────────────────────────────────────────────────────────
// FocusDay — Navigation Types
// ─────────────────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  UploadStack: undefined;
  MainTabs:    undefined;
};

export type UploadStackParamList = {
  Upload: undefined;
};

export type TabParamList = {
  Now:      undefined;
  Schedule: undefined;
};

export type NowStackParamList = {
  CurrentBlock: undefined;
  AllBlocks:    undefined; // pushed from "Next Block" pill tap
};

export type ScheduleStackParamList = {
  AllBlocks:   undefined;
  BlockDetail: { blockId: string };
};
