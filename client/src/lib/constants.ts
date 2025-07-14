export const NAVBAR_HEIGHT = 80;

// forms
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const EMAIL_MAX = 100;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

// profile
export const CYCLE_LENGTH_MIN = 21;
export const CYCLE_LENGTH_MAX = 45;
export const PERIOD_DURATION_MIN = 1;
export const PERIOD_DURATION_MAX = 10;
export const CONTRACEPTION_MAX = 100;
export const NOTES_MAX = 500;

// calendar
export const CALENDAR_CONFIG = {
  showNeighboringMonth: true,
  showFixedNumberOfWeeks: false,
  prevLabel: '‹',
  nextLabel: '›',
  prev2Label: '«',
  next2Label: '»',
  view: 'month' as const,
  maxDetail: 'month' as const,
} as const;

export const WEEKDAY_FORMAT = {
  length: 2,
  uppercase: true,
} as const;
