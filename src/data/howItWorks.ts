export interface HowItWorksStep {
  icon: 'rocket' | 'code' | 'gift';
  title: string;
  body: string;
}

export const playerIntro = {
  title: 'Players earn good-cause points for engaging with responsible play tools',
  body: 'An opt-in programme that rewards checking your play, setting limits and taking the self-assessment. Never spending.',
};

export const howItWorks: HowItWorksStep[] = [
  {
    icon: 'rocket',
    title: 'Missions point to tools you already have',
    body: "Play history, limits and the self-assessment stay in the player's account. Short quizzes and stories live on the pilot page. The operator decides which tools and missions are included, agreed during the concept phase.",
  },
  {
    icon: 'code',
    title: 'Confirmed in real time through the API',
    body: 'When a player uses a tool, the account sends one event with a pseudonymised ID. Their mission updates in real time over the API.',
  },
  {
    icon: 'gift',
    title: 'Rewards go to good causes',
    body: "Points become donations in the player's name. No free plays, no bonus money, no ranking of individual players. This is one option: points can also go towards real prizes. The operator decides, agreed during the concept phase.",
  },
];


export const footerText =
  'All figures and names are sample data for illustration. The pilot only ever receives pseudonymised player IDs; no personal data leaves the operator.';
