import { ObjectValues } from "../utils";

export const playerId = {
  player1: 'Player_1',
  player2: 'Player_2'
} as const;

export type PlayerIdType = ObjectValues<typeof playerId>;
