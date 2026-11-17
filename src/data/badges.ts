/** Badges in the player app, in display order. */

import type { IconName } from '../components/icons';

export type BadgeIcon = IconName;

export type BadgeRule =
  /** Earned by completing every mission in a chapter. */
  | { kind: 'chapter'; chapterId: string }
  /** Earned by completing one mission. */
  | { kind: 'mission'; missionId: string }
  /** Earned by reaching a points total. */
  | { kind: 'points'; points: number };

export interface BadgeDef {
  id: string;
  name: string;
  /** What the player does to earn it. */
  howTo: string;
  icon: BadgeIcon;
  rule: BadgeRule;
}

export const badges: BadgeDef[] = [
  { id: 'know', name: 'Know your play', howTo: 'Finish chapter 1', icon: 'chart', rule: { kind: 'chapter', chapterId: 'ch1' } },
  { id: 'boundaries', name: 'Boundaries', howTo: 'Finish chapter 2', icon: 'shield', rule: { kind: 'chapter', chapterId: 'ch2' } },
  { id: 'selfcheck', name: 'Self-check', howTo: 'Take the self-assessment', icon: 'clipboard', rule: { kind: 'mission', missionId: 'assess' } },
  { id: 'goodcause', name: 'Good cause', howTo: 'Reach 500 points', icon: 'heart', rule: { kind: 'points', points: 500 } },
  { id: 'fun', name: 'Keep it fun', howTo: 'Finish chapter 3', icon: 'star', rule: { kind: 'chapter', chapterId: 'ch3' } },
  { id: 'outabout', name: 'Out and about', howTo: 'Visit a funded project', icon: 'pin', rule: { kind: 'mission', missionId: 'visit' } },
];
