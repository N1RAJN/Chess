// @ts-check
/** @returns {ChessBoardMatrix} */
export function initBoard() {
    /** @type {ChessBoardMatrix} */
    const board = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
    /** @type {PieceType[]} */
    const pieceArray = ["R", "N", "B", "Q", "K", "B", "N", "R"];
    for (let i = 0; i < 8; ++i) {
        board[7][i] = {
            colour: "b",
            type: pieceArray[i],
            file: i + 1,
            rank: 8,
        };
        board[6][i] = {
            colour: "b",
            type: "P",
            file: i + 1,
            rank: 7,
        };

        board[1][i] = {
            colour: "w",
            type: "P",
            file: i + 1,
            rank: 2,
        };
        board[0][i] = {
            colour: "w",
            type: pieceArray[i],
            file: i + 1,
            rank: 1,
        };
    }
    return board;
}

/**
 * @param {ChessBoardMatrix} board
 * @param {number} row
 * @param {number} col
 * @returns {[number, number][]}
 * */
export function getLegalMoves(board, row, col) {
    const piece = board[row][col];

    if (!piece) return [];

    /** @type {[[number, number]]} */
    let moves = [[1, 2]];
    return moves;
}

/**
 */
