export type WinLoseObject = {
  beat: "rock" | "paper" | "scissor";
  loseTo: "rock" | "paper" | "scissor";
};

export type WinLoseMap = {
  rock: WinLoseObject;
  paper: WinLoseObject;
  scissor: WinLoseObject;
};

export type Choices = keyof WinLoseMap;

export const winLoseMap: WinLoseMap = {
  rock: {
    beat: "scissor",
    loseTo: "paper",
  },
  paper: {
    beat: "rock",
    loseTo: "scissor",
  },
  scissor: {
    beat: "paper",
    loseTo: "rock",
  },
};

export const pickedMark = "✅ Picked";
export const pickingMark = "Picking...";
