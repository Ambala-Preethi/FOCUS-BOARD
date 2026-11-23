/**
 * Exactly three Focus Notes slides matching the official Figma design reference frames:
 * - Slide 1 (Figma 15:2): "Make today count." / "A little focus goes a long way."
 * - Slide 2 (Figma 15:30): "Small steps, big progress." / "Build your momentum one task at a time."
 * - Slide 3 (Figma 15:58): "Celebrate the wins." / "Every completed task moves you forward."
 */
export const FOCUS_NOTES_SLIDES = [
  {
    id: 1,
    tag: 'FOCUS NOTES',
    counter: '01 / 03',
    title: 'Make today count.',
    subtitle: 'A little focus goes a long way.',
    previewBadge: 'FOCUS',
    previewBadgeType: 'focus',
    previewTask: 'Design landing page',
    progress: 65,
    progressLabel: '65%'
  },
  {
    id: 2,
    tag: 'FOCUS NOTES',
    counter: '02 / 03',
    title: 'Small steps, big progress.',
    subtitle: 'Build your momentum one task at a time.',
    previewBadge: 'IN PROGRESS',
    previewBadgeType: 'progress',
    previewTask: 'Fix mobile navigation',
    progress: 45,
    progressLabel: '45%'
  },
  {
    id: 3,
    tag: 'FOCUS NOTES',
    counter: '03 / 03',
    title: 'Celebrate the wins.',
    subtitle: 'Every completed task moves you forward.',
    previewBadge: 'COMPLETED',
    previewBadgeType: 'completed',
    previewTask: 'Review onboarding copy',
    progress: 100,
    progressLabel: '100%'
  }
];
