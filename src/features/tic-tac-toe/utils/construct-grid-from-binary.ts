export function constructGridFromBinary(
  playerMovesInBinary: number,
  opponentMovesInBinary: number,
): string {
  const rowsArray = new Array(5).fill(null);

  const defaultMovesRows = ["000", "000", "000"];

  const playerMovesRows =
    playerMovesInBinary
      .toString(2)
      .padStart(9, "0")
      .match(/.{1,3}/g) ?? defaultMovesRows;
  const opponentMovesRows =
    opponentMovesInBinary
      .toString(2)
      .padStart(9, "0")
      .match(/.{1,3}/g) ?? defaultMovesRows;

  console.log("PLAYER", playerMovesRows);
  console.log("OPPONENT", opponentMovesRows);

  const board = rowsArray.map((_, index) => {
    if ((index + 1) % 2) {
      const playerRow = playerMovesRows[index / 2];
      const opponentRow = opponentMovesRows[index / 2];

      return ` ${!!+playerRow[0] ? "x" : !!+opponentRow[0] ? "o" : " "} | ${!!+playerRow[1] ? "x" : !!+opponentRow[1] ? "o" : " "} | ${!!+playerRow[2] ? "x" : !!+opponentRow[2] ? "o" : " "} `;
    } else {
      return "---|---|---";
    }
  });

  const boardInCodeBlock = "```\n" + board.join("\n") + "\n```";

  return boardInCodeBlock;
}
