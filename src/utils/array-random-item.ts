export function randomArrayItem<T>(array: (keyof T)[]) {
  const limit = array.length;
  const randomNumber = Math.random();

  return array[Math.floor(randomNumber * limit)];
}
