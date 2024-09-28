export function constructGridFromBinary(
  playerMoves: number,
  opponentMoves: number,
): string {
  let grid = Array(9).fill(" ");

  for (let i = 0; i < 9; i++) {
    if (playerMoves & (1 << (8 - i))) {
      grid[i] = "X";
    } else if (opponentMoves & (1 << (8 - i))) {
      grid[i] = "O";
    }
  }

  return ` ${grid[0]} | ${grid[1]} | ${grid[2]} \n---|---|---\n ${grid[3]} | ${grid[4]} | ${grid[5]} \n---|---|---\n ${grid[6]} | ${grid[7]} | ${grid[8]} `;
}
