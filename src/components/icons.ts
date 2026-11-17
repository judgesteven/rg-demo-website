/** Line icons on a 24 × 24 grid, drawn with a 2px round stroke. Shared by badges and mission art. */
export const iconPaths = {
  chart: 'M6 19v-6 M12 19V5 M18 19v-9',
  shield: 'M12 3l7 3v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6z',
  clipboard: 'M9 3.5h6v3H9z M8 5H5.5v15.5h13V5H16 M9 13.5l2 2 4-4',
  heart: 'M12 20s-7.5-4.4-7.5-9.6A4.2 4.2 0 0112 8a4.2 4.2 0 017.5 2.4C19.5 15.6 12 20 12 20z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z M12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  question: 'M12 21a9 9 0 100-18 9 9 0 000 18z M9.5 9.5a2.5 2.5 0 115 .3c0 1.7-2.5 2.2-2.5 3.7 M12 16.5h.01',
  history: 'M4.5 12a7.5 7.5 0 102.2-5.3 M4.5 4.5v3.5H8 M12 8v4.2l2.8 1.8',
  dice: 'M5 5h14v14H5z M9 9h.01 M15 9h.01 M12 12h.01 M9 15h.01 M15 15h.01',
  gauge: 'M4 17a8 8 0 0116 0 M12 17l4-5 M4 17h2 M18 17h2',
  bulb: 'M9.5 18h5 M10.5 21h3 M12 3a6 6 0 00-3.6 10.8c.4.3.6.8.6 1.2v1h6v-1c0-.4.2-.9.6-1.2A6 6 0 0012 3z',
  calendar: 'M4.5 6h15v14h-15z M4.5 10h15 M8.5 3.5v4 M15.5 3.5v4',
} as const;

export type IconName = keyof typeof iconPaths;
