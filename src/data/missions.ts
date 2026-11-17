import type { IconName } from '../components/icons';
import type { Chapter } from '../backend/RewardsBackend';

/** Points awarded for each mission. */
export const POINTS_PER_MISSION = 50;

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    name: 'Know your play',
    badge: 'Know your play',
    weeks: [1, 2],
    unlockWeek: 1,
    missions: [
      {
        id: 'reflect',
        title: 'How do you like to play?',
        description: 'Three quick questions about what makes playing fun for you.',
        where: 'page',
        cta: 'Start',
        points: POINTS_PER_MISSION,
      },
      {
        id: 'history',
        title: 'Check your play history',
        description: 'Open your play and spend summary in your account.',
        where: 'account',
        cta: 'Open account',
        points: POINTS_PER_MISSION,
        event: 'play_history_viewed',
      },
      {
        id: 'odds',
        title: 'How the odds really work',
        description: 'A five-question quiz with no wrong answers.',
        where: 'page',
        cta: 'Take quiz',
        points: POINTS_PER_MISSION,
      },
    ],
  },
  {
    id: 'ch2',
    number: 2,
    name: 'Set your own boundaries',
    badge: 'Boundaries',
    weeks: [3, 6],
    unlockWeek: 3,
    missions: [
      {
        id: 'limit',
        title: 'Set or review a limit',
        description: 'Look at your spend limit. Raise it, lower it or keep it: your call.',
        where: 'account',
        cta: 'Review limit',
        points: POINTS_PER_MISSION,
        event: 'limit_reviewed',
      },
      {
        id: 'assess',
        title: 'Take the self-assessment',
        description: 'A few minutes, in your account.',
        where: 'account',
        cta: 'Start',
        points: POINTS_PER_MISSION,
        event: 'self_assessment_completed',
      },
      {
        id: 'myths',
        title: 'Myth-busters',
        description: 'Six short cards on common beliefs about luck and winning.',
        where: 'page',
        cta: 'Start',
        points: POINTS_PER_MISSION,
      },
    ],
  },
  {
    id: 'ch3',
    number: 3,
    name: 'Keep it fun',
    badge: 'Keep it fun',
    weeks: [7, 12],
    unlockWeek: 7,
    missions: [
      {
        id: 'checkin',
        title: 'Monthly check-in',
        description: 'Another look at your play history, once a month.',
        where: 'account',
        cta: 'Open account',
        points: POINTS_PER_MISSION,
        event: 'play_history_viewed',
      },
      {
        id: 'causes',
        title: 'Where the money goes',
        description: 'Stories from projects your play helps fund.',
        where: 'page',
        cta: 'Read',
        points: POINTS_PER_MISSION,
      },
      {
        id: 'visit',
        title: 'Visit a funded project',
        description: 'Check in at a local place supported by good causes.',
        where: 'place',
        cta: 'Check in',
        points: POINTS_PER_MISSION,
        event: 'location_checkin',
      },
    ],
  },
];

/**
 * Placeholder artwork for each mission card, used until a real image is set.
 * To add a photo: put it in public/missions/ and set `image: { src, alt }` on
 * the mission above, e.g. { src: '/missions/odds.jpg', alt: 'Lottery balls' }.
 */
export const missionArt: Record<string, IconName> = {
  reflect: 'question',
  history: 'history',
  odds: 'dice',
  limit: 'gauge',
  assess: 'clipboard',
  myths: 'bulb',
  checkin: 'calendar',
  causes: 'heart',
  visit: 'pin',
};
