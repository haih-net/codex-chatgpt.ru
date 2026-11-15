const breakpoints = {
  xs: 560,
  sm: 800,
  md: 1050,
  lg: 1200,
  xl: 1440,
} as const

const colors = {
  // Primary colors
  primary: '#235b82',
  primaryHover: '#194664',
  secondary: '#52616d',
  foreground: '#27343e',
  background: '#ffffff',
  muted: '#9ca3af',

  // States
  success: '#10b981',
  successBg: '#eaf6ed',
  successText: '#246a39',
  successBorder: '#c5dfcb',
  error: '#ef4444',
  errorBg: '#fff2f1',
  errorText: '#a52c2c',
  errorBorder: '#f0c9c5',
  errorHover: '#ffe3df',
  warning: '#f59e0b',
  warningBg: '#fff6de',
  warningText: '#79500a',
  warningBorder: '#ead7a2',
  info: '#3b82f6',
  infoBg: '#eff6ff',

  // Text
  text: {
    primary: '#27343e',
    secondary: '#52616d',
    disabled: '#9ca3af',
    light: '#ffffff',
  },
  textMuted: '#9ca3af',

  // Borders and dividers
  divider: '#d5dce2',
  border: '#d5dce2',
  borderHover: '#899ba8',
  heading: '#202b33',

  // Special
  star: '#fbbf24',
  starEmpty: '#e5e7eb',

  // Gray scale (Tailwind)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const

const backgrounds = {
  page: '#ffffff',
  paper: '#ffffff',
  subtle: '#f3f5f7',
  hover: '#eef1f4',
  code: '#f6f8fa',
  codeDark: '#0f172a',
  elevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const

export const theme = {
  outline: 'none',
  font: 'Arial, Helvetica, sans-serif',
  colors,
  backgrounds,
  breakpoints,

  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },

  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 3px rgba(35, 91, 130, 0.18)',
    accent: '0 4px 12px rgba(35, 91, 130, 0.24)',
    accentHover: '0 6px 16px rgba(35, 91, 130, 0.32)',
    header: '0 16px 24px rgba(39, 52, 62, 0.07)',
    popover: '0 12px 32px rgba(39, 52, 62, 0.1)',
    surface: '0 1px 3px rgba(0, 0, 0, 0.08)',
    input: '0 2px 12px rgba(0, 0, 0, 0.08)',
    dialog: '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
  },

  zIndex: {
    dropdown: 100,
    sticky: 200,
    header: 300,
    overlay: 400,
    modal: 1000,
    popover: 1100,
    tooltip: 1200,
  },
}

export type Theme = typeof theme

export type ThemeProps = { theme?: Theme }
