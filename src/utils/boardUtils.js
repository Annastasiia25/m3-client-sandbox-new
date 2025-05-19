// Генерация поля со случайными фишками
export function generateBoard(size = 6, colors = ['red', 'blue', 'green', 'yellow', 'purple']) {
  const board = [];
  for (let row = 0; row < size; row++) {
    const currentRow = [];
    for (let col = 0; col < size; col++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      currentRow.push({ color: randomColor, id: `${row}-${col}` });
    }
    board.push(currentRow);
  }
  return board;
}