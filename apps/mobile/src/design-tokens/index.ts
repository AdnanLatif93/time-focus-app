// ─────────────────────────────────────────────────────────────────────────────
// FocusDay Design Tokens
// This file is theme-independent. Import from theme/index.ts for semantic values.
// ─────────────────────────────────────────────────────────────────────────────

// ─── COLORS ──────────────────────────────────────────────────────────────────
const colors = {

  // Brand
  brand: {
    primary:   '#F5C347', // Amber — main accent
    onPrimary: '#0D0D0D', // Text/icon on top of amber
  },

  // Surfaces (dark-first)
  surface: {
    base:     '#0D0D0D', // App background
    card:     '#181818', // Card background
    elevated: '#222222', // Modal, bottom sheet, elevated card
    border:   '#2A2A2A', // Dividers, input borders
  },

  // Category colors — each task category has a main + light (bg tint) variant
  category: {
    jism: {
      // جسم — Physical / Body
      main:  '#3B8BD4',
      light: '#1A3A5C',
    },
    rooh: {
      // روح — Spiritual / Soul
      main:  '#1D9E75',
      light: '#0A3D2E',
    },
    dimag: {
      // دماغ — Mental / Mind (shares brand amber)
      main:  '#F5C347',
      light: '#3D2E00',
    },
  },

  // Block status
  status: {
    active:   '#F5C347', // Currently running block
    done:     '#2A2A2A', // Completed block
    upcoming: '#333333', // Future block
  },

  // Text
  text: {
    primary:  '#FFFFFF',
    secondary: '#888888',
    muted:    '#444444',
    disabled: '#2A2A2A',
  },

  // Feedback
  feedback: {
    success: '#1D9E75',
    warning: '#F5C347',
    danger:  '#E24B4A',
  },

  // Light mode surface variants (reserved for future light theme)
  light: {
    base:     '#F5F5F5',
    card:     '#FFFFFF',
    elevated: '#EFEFEF',
    border:   '#DDDDDD',
  },

} as const;

// ─── SPACING ─────────────────────────────────────────────────────────────────
const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  xxxl: 48,
} as const;

// ─── RADIUS ──────────────────────────────────────────────────────────────────
const radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   18,
  xl:   24,
  pill: 100,
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
const typography = {

  // Font families
  fonts: {
    sans: 'DM Sans',  // Default UI font
    mono: 'DM Mono',  // Time display (e.g. 04:30)
  },

  // Type scale: { fontSize, fontWeight, lineHeight }
  scale: {
    display: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
    h1:      { fontSize: 22, fontWeight: '600' as const, lineHeight: 30 },
    h2:      { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
    h3:      { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
    body:    { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
    caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
    tiny:    { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
  },

} as const;

// ─── SHADOWS ─────────────────────────────────────────────────────────────────
// Android uses `elevation`; iOS uses shadow* props.
// These are Android elevation values — pair with shadowColor for iOS.
const shadows = {
  subtle: {
    elevation:   2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  card: {
    elevation:   6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  elevated: {
    elevation:   12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
} as const;

// ─── ANIMATION ───────────────────────────────────────────────────────────────
const animation = {
  // Durations in milliseconds
  duration: {
    fast:   150,
    normal: 250,
    slow:   400,
  },
  // Easing curve names (use with Animated / Reanimated)
  easing: {
    standard:    'ease-in-out',
    decelerate:  'ease-out',   // Enter animations
    accelerate:  'ease-in',    // Exit animations
    sharp:       'linear',     // Precise movements (e.g. progress bars)
  },
} as const;

// ─── TOKENS (single export) ───────────────────────────────────────────────────
export const tokens = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  animation,
} as const;

// Derive the TypeScript type from the value
export type Tokens = typeof tokens;
