export interface HowItWorksStep {
  icon: 'rocket' | 'code' | 'gift';
  title: string;
  body: string;
}

export const playerIntro = {
  title: 'Players earn good-cause points for engaging with responsible play tools',
  body: 'An opt-in programme that rewards checking your play, setting limits and taking the self-assessment test. Never spending.',
};

export const howItWorks: HowItWorksStep[] = [
  {
    icon: 'rocket',
    title: 'Tools you already have are wrapped into missions',
    body: "Play history, limits and the self-assessment stay in the player's account. Short quizzes and polls can be built and managed by GameLayer and live directly in the pilot portal. Operator decides which tools and missions are to be included.",
  },
  {
    icon: 'code',
    title: 'One event per action, no personal data',
    body: 'When a player uses a tool, your platform sends GameLayer a single event with a pseudonymised ID. Nothing else is shared. Their mission progress updates instantly in the pilot portal.',
  },
  {
    icon: 'gift',
    title: 'Rewards go to good causes',
    body: "Points become donations in the player's name. No free plays, no bonus money, no ranking of individual players. This is just one option: points can also go towards real prizes. Operator decides on what and how much to reward.",
  },
];


export const footerText =
  'All figures and names are sample data for illustration. The pilot only ever receives pseudonymised player IDs; no personal data leaves the operator.';
