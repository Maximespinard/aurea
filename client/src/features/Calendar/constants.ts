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