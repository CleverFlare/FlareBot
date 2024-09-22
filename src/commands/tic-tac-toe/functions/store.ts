const zeroMovesBinary = 0b000000000;

class Game {
  public turn;

  constructor(
    public playerId: string,
    public opponentId: string | "NPC" = "NPC",
    public playerMoves: number = zeroMovesBinary,
    public opponentMoves: number = zeroMovesBinary,
    turn: "player" | "opponent" = "player",
  ) {
    this.turn = new Turn(this.playerId, this.opponentId, turn);
  }

  get availableMoves() {
    return this.playerMoves | this.opponentMoves;
  }
}

class Turn {
  #_turn: 0 | 1;
  #_playerId: string;
  #_opponentId: string;

  constructor(
    playerId: string,
    opponentId: string,
    initial: "player" | "opponent" = "player",
  ) {
    this.#_playerId = playerId;
    this.#_opponentId = opponentId;

    if (initial === "player") this.#_turn = 0;
    else this.#_turn = 1;
  }

  get turn() {
    return this.#_turn === 0 ? this.#_playerId : this.#_opponentId;
  }

  swap() {
    if (this.#_turn === 0) this.#_turn = 1;
    else if (this.#_turn === 1) this.#_turn = 0;
  }
}

const games: Game[] = [];

export function findGame(playerId: string, opponentId?: string): Game {
  opponentId = opponentId !== undefined ? opponentId : "NPC";

  let game = games.find(
    (game) => game.playerId === playerId && game.opponentId === opponentId,
  );

  if (!game) {
    games.push(new Game(playerId, opponentId));

    game = games.at(-1);
  }

  return game!;
}
