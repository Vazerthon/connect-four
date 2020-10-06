import chalk from 'chalk';
import promptSync from 'prompt-sync';
import { makeReducer, getInitialGameState } from './board';

const prompt = promptSync({ sigint: true });
const colouredCell = (cell) => (cell ? chalk[cell]('⬤') : chalk.white('⬤'));
const rowAsString = (row) => row.map(colouredCell).join(' ');
const boardToStringRows = (board) => board.map(rowAsString);
const renderRow = (rowString) => console.log(rowString);
const renderBoard = (board) => {
  console.clear();
  boardToStringRows(board).map(renderRow);
  console.log('0 1 2 3 4 5 6');
};

const playGame = (gameState) => {
  renderBoard(gameState.board);

  if (gameState.winningPlayer) {
    console.log(`Player ${gameState.winningPlayer} wins!!`);
    return;
  }

  const reducer = makeReducer(gameState);
  const column = prompt(`Player ${gameState.currentPlayer}, play at column: `);
  const nextState = reducer({
    action: 'playPieceAtColumn',
    payload: { column: Number(column) },
  });

  playGame(nextState);
};

playGame(getInitialGameState());
