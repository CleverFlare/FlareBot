import { Choices } from "./constants";

class Game {
  constructor(
    public playerId: string,
    public opponentId: string | "CPU" = "CPU",
    public playerChoice: Choices | null = null,
    public opponentChoice: Choices | null = null,
  ) {}
}

const games: Game[] = [];

export function findGame(playerId: string, opponentId?: string): Game {
  opponentId = opponentId !== undefined ? opponentId : "CPU";

  let game = games.find(
    (game) => game.playerId === playerId && game.opponentId === opponentId,
  );

  if (!game) {
    games.push(new Game(playerId, opponentId));

    game = games.at(-1);
  }

  return game!;
}

export function removeGame(game: Game): void {
  const gameIndex = games.findIndex((currentGame) => currentGame === game);

  games.splice(gameIndex, 1);
}
