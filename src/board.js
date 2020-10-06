import { compose, assocPath } from 'ramda';

const COLUMN_COUNT = 7;
const ROW_COUNT = 6;

const makeArrayOf = (fill) => (length) => Array(length).fill(fill);
const makeArrayOfNulls = makeArrayOf(null);
const makeGameBoard = () =>
  makeArrayOf(makeArrayOfNulls(COLUMN_COUNT))(ROW_COUNT);

const getColumn = (board, column) =>
  board.reduce(
    (col, _, i) => [...col, { row: i, column, value: board[i][column] }],
    [],
  );

const getRow = (board, row) =>
  board[row].map((_, i) => ({ row, column: i, value: board[row][i] }));

const getNextPlayableCellForColumn = (column) =>
  column.reverse().find(({ value }) => value === null);

export const getInitialGameState = () => ({
  board: makeGameBoard(),
  players: { 1: 'red', 2: 'yellow' },
  currentPlayer: 1,
  winningPlayer: undefined,
});

export const makeReducer = (state) => ({ action, payload }) => {
  const checkForWinState = (gameState) => {
    const allRows = gameState.board.map((_, i) => getRow(gameState.board, i));
    const allColumns = makeArrayOfNulls(COLUMN_COUNT).map((_, i) =>
      getColumn(gameState.board, i),
    );

    return {
      ...gameState,
      allColumns,
      allRows,
    };
  };

  const playCurrentPlayerAt = ({ column, row }) => ({
    ...assocPath(
      ['board', row, column],
      state.players[state.currentPlayer],
      state,
    ),
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
  });

  const playPieceAtColumn = () =>
    compose(
      checkForWinState,
      playCurrentPlayerAt,
      getNextPlayableCellForColumn,
      getColumn,
    )(state.board, payload.column);

  return {
    playPieceAtColumn,
  }[action]();
};
