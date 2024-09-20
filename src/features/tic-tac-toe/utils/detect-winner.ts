export function detectWinner(
  playerMoves: number,
  opponentMoves: number,
  winningCombos: number[],
): "player" | "opponent" | null {
  for (const winningCombo of winningCombos) {
    if ((playerMoves & winningCombo) === winningCombo) return "player";
    else if ((opponentMoves & winningCombo) === winningCombo) return "opponent";
  }

  return null;
}
