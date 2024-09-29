export function storeMove(
  turnUser: string,
  playerId: string,
  opponentId: string,
  onPlayerMove: () => any,
  onOpponentMove: () => any,
) {
  const isPlayerMove = turnUser === playerId;

  if (isPlayerMove) {
    onPlayerMove();
    return;
  }

  const isOpponentMove = turnUser === opponentId;

  if (isOpponentMove) {
    onOpponentMove();
    return;
  }
}
