// each digit represents a cell, we have 9 digits of the 9 cells
// 0 represents an empty cell, while 1 represents none-empty cell
export const emptyCellsBinary = 0b000000000;

export const completedGrid = 0b111111111;

export const winningCombos = [
  // horizontal
  0b111000000, 0b000111000, 0b000000111,
  // vertical
  0b100100100, 0b010010010, 0b001001001,
  // diagonal
  0b100010001, 0b001010100,
];
