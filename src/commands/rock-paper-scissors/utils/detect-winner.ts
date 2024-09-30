import { Choices, winLoseMap } from "../constants";

type Options = {
  onWinOrLose?: () => any;
  onPlayerWin?: () => any;
  onOpponentWin?: () => any;
  onPlayerLose?: () => any;
  onOpponentLose?: () => any;
};

export function detectWinner(
  playerId: string,
  opponentId: string | null | undefined,
  playerChoice: Choices,
  opponentChoice: Choices,
  options?: Options,
) {
  const isOpponentCpu = !opponentId;

  if (winLoseMap[playerChoice!].beat === opponentChoice) {
    options?.onWinOrLose?.();
    options?.onPlayerWin?.();
    options?.onOpponentLose?.();
    return `<@${playerId}>`;
  } else if (winLoseMap[playerChoice!].loseTo === opponentChoice) {
    options?.onWinOrLose?.();
    options?.onOpponentWin?.();
    options?.onPlayerLose?.();
    if (isOpponentCpu) return "Computer";
    else return `<@${opponentId}>`;
  }

  return null;
}
