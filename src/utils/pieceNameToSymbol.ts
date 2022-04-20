export const pieceNameToSymbol = (name: string): string => {
  const start = name.substring(0, 5);
  const end = name.substring(5);

  return start[0] + end[0] + end[end.length - 1]
}