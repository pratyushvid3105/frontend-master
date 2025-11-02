import { useReducer } from "react";

const NUM_COL = 7;
const NUM_ROW = 6;
const NUM_TO_WIN = 4;

export default function ConnectFour() {
  /*
    [
      [topLeft, ......, bottomLeft],
      ...
      [topRight, ......, bottomRight]
    ]
  */
  const [{ board, winner, isGameOver }, dispatchBoard] = useReducer(
    reducer,
    genEmptyState()
  );
  return (
    <>
      {winner != null && <h1>Player {winner} Wins</h1>}
      <div className="board">
        {board.map((colEntries, colIndex) => {
          const onClickCol = () => {
            dispatchBoard({ type: "move", colIndex });
          };
          return (
            <Column key={colIndex} entries={colEntries} onClick={onClickCol} />
          );
        })}
      </div>
      {isGameOver && (
        <button
          onClick={() => {
            dispatchBoard({ type: "restart" });
          }}
        >
          Restart
        </button>
      )}
    </>
  );
}

function Column({ entries, onClick }) {
  return (
    <div className="column" onClick={onClick}>
      {entries.map((entry, rowIndex) => {
        return (
          <div key={rowIndex} className="tile">
            {entry != null && <div className={`player player-${entry}`} />}
          </div>
        );
      })}
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "restart":
      return genEmptyState();
    case "move":
      const relevantCol = state.board[action.colIndex];
      const isColFull = relevantCol[0] != null;
      if (state.isGameOver || isColFull) return state;

      const { board, currentPlayer } = state;
      const boardClone = [...board];
      const colClone = [...relevantCol];

      const rowIndex = colClone.lastIndexOf(null);
      colClone[rowIndex] = currentPlayer;
      boardClone[action.colIndex] = colClone;

      const didWinVertical = didWin(
        boardClone,
        rowIndex,
        action.colIndex,
        1,
        0,
        currentPlayer
      );
      const didWinHorizontal = didWin(
        boardClone,
        rowIndex,
        action.colIndex,
        0,
        1,
        currentPlayer
      );
      const didWinDiagonal =
        didWin(boardClone, rowIndex, action.colIndex, 1, 1, currentPlayer) ||
        didWin(boardClone, rowIndex, action.colIndex, -1, 1, currentPlayer);

      const winner =
        didWinVertical || didWinHorizontal || didWinDiagonal
          ? currentPlayer
          : null;
      const isBoardFull = boardClone.every((column) =>
        column.every((val) => val != null)
      );

      return {
        board: boardClone,
        currentPlayer: currentPlayer === 1 ? 2 : 1,
        winner,
        isGameOver: winner != null || isBoardFull,
      };
    default:
      throw new Error("Unexpected action type");
  }
}

function genEmptyState() {
  return {
    board: new Array(NUM_COL)
      .fill(null)
      .map((_) => new Array(NUM_ROW).fill(null)),
    currentPlayer: 1 /* need this for the reducer function */,
    winner: null,
    isGameOver: false,
  };
}

function didWin(
  board,
  startingRow,
  startingColumn,
  rowIncrement,
  colIncrememt,
  currentPlayer
) {
  let numInRow = 0;
  let currRow = startingRow;
  let currColumn = startingColumn;

  while (
    currColumn < NUM_COL &&
    currRow < NUM_ROW &&
    board[currColumn][currRow] === currentPlayer
  ) {
    numInRow++;
    currRow += rowIncrement;
    currColumn += colIncrememt;
  }

  currRow = startingRow - rowIncrement;
  currColumn = startingColumn - colIncrememt;
  while (
    currColumn >= 0 &&
    currRow >= 0 &&
    board[currColumn][currRow] === currentPlayer
  ) {
    numInRow++;
    currRow -= rowIncrement;
    currColumn -= colIncrememt;
  }

  return numInRow >= NUM_TO_WIN;
}
