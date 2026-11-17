import type { RewardsBackend } from './RewardsBackend';
import { createMockBackend } from './mockBackend';
import { createGameLayerBackend } from './gameLayerBackend';

/** The single backend the app talks to. Set VITE_BACKEND=gamelayer to switch. */
export const backend: RewardsBackend =
  import.meta.env.VITE_BACKEND === 'gamelayer'
    ? createGameLayerBackend({
        baseUrl: import.meta.env.VITE_GAMELAYER_URL ?? '',
        accountId: import.meta.env.VITE_GAMELAYER_ACCOUNT ?? '',
        getToken: async () => {
          throw new Error('TODO: fetch a player token from the operator backend');
        },
      })
    : createMockBackend();

export * from './RewardsBackend';
