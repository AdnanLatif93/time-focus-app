// ─────────────────────────────────────────────────────────────────────────────
// FocusDay Theme Layer
// Semantic mappings on top of raw design tokens.
// Import THIS file in components — never import design-tokens directly.
// ─────────────────────────────────────────────────────────────────────────────

import { tokens } from '../design-tokens';

// ─── Category slot shape ─────────────────────────────────────────────────────
interface CategorySlot {
  bg:     string;
  text:   string;
  border: string;
}

// ─── Status slot shape ───────────────────────────────────────────────────────
interface StatusSlot {
  bg:   string;
  text: string;
}

// ─── Feedback slot shape ─────────────────────────────────────────────────────
interface FeedbackSlot {
  bg:     string;
  text:   string;
  border: string;
}

// ─── Full Theme type ─────────────────────────────────────────────────────────
export interface Theme {
  colors: {
    background: {
      primary:   string; // Main app background
      secondary: string; // Slightly lifted background
      tertiary:  string; // Further lifted (modals, sheets)
    };
    surface: {
      base:     string;
      card:     string;
      elevated: string;
      border:   string;
    };
    text: {
      primary:   string;
      secondary: string;
      muted:     string;
      disabled:  string;
      inverse:   string; // Text on brand/accent backgrounds
    };
    brand: {
      primary:   string;
      onPrimary: string;
    };
    category: {
      jism:  CategorySlot;
      rooh:  CategorySlot;
      dimag: CategorySlot;
    };
    status: {
      active:   StatusSlot;
      done:     StatusSlot;
      upcoming: StatusSlot;
    };
    feedback: {
      success: FeedbackSlot;
      warning: FeedbackSlot;
      danger:  FeedbackSlot;
    };
  };
  spacing:    typeof tokens.spacing;
  radius:     typeof tokens.radius;
  typography: typeof tokens.typography;
  animation:  typeof tokens.animation;
  shadows:    typeof tokens.shadows;
}

// ─── Dark Theme (primary) ────────────────────────────────────────────────────
export const darkTheme: Theme = {
  colors: {
    background: {
      primary:   tokens.colors.surface.base,     // #0D0D0D
      secondary: tokens.colors.surface.card,     // #181818
      tertiary:  tokens.colors.surface.elevated, // #222222
    },
    surface: {
      base:     tokens.colors.surface.base,
      card:     tokens.colors.surface.card,
      elevated: tokens.colors.surface.elevated,
      border:   tokens.colors.surface.border,
    },
    text: {
      primary:   tokens.colors.text.primary,   // #FFFFFF
      secondary: tokens.colors.text.secondary, // #888888
      muted:     tokens.colors.text.muted,     // #444444
      disabled:  tokens.colors.text.disabled,  // #2A2A2A
      inverse:   tokens.colors.brand.onPrimary, // #0D0D0D (on amber)
    },
    brand: {
      primary:   tokens.colors.brand.primary,   // #F5C347
      onPrimary: tokens.colors.brand.onPrimary, // #0D0D0D
    },
    category: {
      jism: {
        bg:     tokens.colors.category.jism.light, // #1A3A5C
        text:   tokens.colors.category.jism.main,  // #3B8BD4
        border: tokens.colors.category.jism.main,
      },
      rooh: {
        bg:     tokens.colors.category.rooh.light, // #0A3D2E
        text:   tokens.colors.category.rooh.main,  // #1D9E75
        border: tokens.colors.category.rooh.main,
      },
      dimag: {
        bg:     tokens.colors.category.dimag.light, // #3D2E00
        text:   tokens.colors.category.dimag.main,  // #F5C347
        border: tokens.colors.category.dimag.main,
      },
    },
    status: {
      active: {
        bg:   tokens.colors.status.active,          // #F5C347
        text: tokens.colors.brand.onPrimary,        // #0D0D0D
      },
      done: {
        bg:   tokens.colors.status.done,            // #2A2A2A
        text: tokens.colors.text.secondary,         // #888888
      },
      upcoming: {
        bg:   tokens.colors.status.upcoming,        // #333333
        text: tokens.colors.text.secondary,         // #888888
      },
    },
    feedback: {
      success: {
        bg:     '#0A3D2E',
        text:   tokens.colors.feedback.success,     // #1D9E75
        border: tokens.colors.feedback.success,
      },
      warning: {
        bg:     '#3D2E00',
        text:   tokens.colors.feedback.warning,     // #F5C347
        border: tokens.colors.feedback.warning,
      },
      danger: {
        bg:     '#3D0A0A',
        text:   tokens.colors.feedback.danger,      // #E24B4A
        border: tokens.colors.feedback.danger,
      },
    },
  },
  spacing:    tokens.spacing,
  radius:     tokens.radius,
  typography: tokens.typography,
  animation:  tokens.animation,
  shadows:    tokens.shadows,
};

// ─── Light Theme (secondary / future) ────────────────────────────────────────
export const lightTheme: Theme = {
  colors: {
    background: {
      primary:   tokens.colors.light.base,     // #F5F5F5
      secondary: tokens.colors.light.card,     // #FFFFFF
      tertiary:  tokens.colors.light.elevated, // #EFEFEF
    },
    surface: {
      base:     tokens.colors.light.base,
      card:     tokens.colors.light.card,
      elevated: tokens.colors.light.elevated,
      border:   tokens.colors.light.border,
    },
    text: {
      primary:   '#0D0D0D',
      secondary: '#555555',
      muted:     '#999999',
      disabled:  '#CCCCCC',
      inverse:   '#FFFFFF',
    },
    brand: {
      primary:   tokens.colors.brand.primary,
      onPrimary: tokens.colors.brand.onPrimary,
    },
    category: {
      jism: {
        bg:     '#D6E9F8',
        text:   '#1A5FA0',
        border: '#3B8BD4',
      },
      rooh: {
        bg:     '#C8EFE2',
        text:   '#0E6B4E',
        border: '#1D9E75',
      },
      dimag: {
        bg:     '#FEF3CC',
        text:   '#8A6A00',
        border: '#F5C347',
      },
    },
    status: {
      active: {
        bg:   tokens.colors.brand.primary,
        text: tokens.colors.brand.onPrimary,
      },
      done: {
        bg:   '#E0E0E0',
        text: '#777777',
      },
      upcoming: {
        bg:   '#EEEEEE',
        text: '#555555',
      },
    },
    feedback: {
      success: {
        bg:     '#E6F7F1',
        text:   '#0E6B4E',
        border: '#1D9E75',
      },
      warning: {
        bg:     '#FEF3CC',
        text:   '#8A6A00',
        border: '#F5C347',
      },
      danger: {
        bg:     '#FDEAEA',
        text:   '#B71C1C',
        border: '#E24B4A',
      },
    },
  },
  spacing:    tokens.spacing,
  radius:     tokens.radius,
  typography: tokens.typography,
  animation:  tokens.animation,
  shadows:    tokens.shadows,
};
