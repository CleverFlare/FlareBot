export function handleCpuMove(
  availableMoves: number,
  opponentMoves: number,
  opponentId: string | null | undefined,
  callback: (cpuMove: number) => any,
) {
  const isOppnentCpu = !opponentId;

  if (!isOppnentCpu) return;

  const availableMovesStr = availableMoves.toString(2).padStart(9, "0");
  let opponentMovesStr = opponentMoves.toString(2).padStart(9, "0");

  const zeroPositions = [...availableMovesStr].reduce<number[]>(
    (acc, bit, index) => {
      if (bit === "0") acc.push(index);
      return acc;
    },
    [],
  );

  if (zeroPositions.length === 0) return opponentMoves;

  const randomIndex =
    zeroPositions[Math.floor(Math.random() * zeroPositions.length)];

  opponentMovesStr =
    opponentMovesStr.substring(0, randomIndex) +
    "1" +
    opponentMovesStr.substring(randomIndex + 1);

  const cpuMove = parseInt(opponentMovesStr, 2);

  callback(cpuMove);
}
