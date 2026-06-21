import { knightMoves, straight, diagonal } from "./moveDirections";
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
            id: `b${pieceArray[i]}${i}`,
            colour: "b",
            type: pieceArray[i],
            file: i + 1,
            rank: 8,
        };

        board[6][i] = {
            id: `bP${i}`,
            colour: "b",
            type: "P",
            file: i + 1,
            rank: 7,
        };
        board[1][i] = {
            id: `wP${i}`,
            colour: "w",
            type: "P",
            file: i + 1,
            rank: 2,
        };

        board[0][i] = {
            id: `w${pieceArray[i]}${i}`,
            colour: "w",
            type: pieceArray[i],
            file: i + 1,
            rank: 1,
        };
    }
    return board;
}
/** @param {number} r
/** @param {number} c
 ** @return {boolean}
 */
function inBounds(r, c) {
    return r < 8 && c < 8 && r >= 0 && c >= 0;
}

/**
 * @param {ChessBoardMatrix} board
 * @param {number} row
 * @param {number} col
 * @returns {[number, number, string][]} moves
 * */
function calculatePawnMoves(board, row, col) {
    /**@type {ChessPiece}*/
    const pawn = board[row][col];
    if (pawn.type !== "P") throw new Error("Not a pawn");

    const initRow = pawn.colour === "w" ? 1 : 6;
    const dr = pawn.colour === "b" ? -1 : 1;
    const moves = [];

    const oneStep = row + dr;
    if (inBounds(oneStep, col) && board[oneStep][col] === null) {
        moves.push([oneStep + 1, col + 1, "move"]);
        const twoStep = row + dr * 2;
        if (row === initRow && board[oneStep][col] === null)
            moves.push([twoStep + 1, col + 1, "move"]);
    }

    for (const dc of [-1, 1]) {
        const r = row + dr;
        const c = col + dc;
        if (
            inBounds(r, c) &&
            board[r][c] !== null &&
            board[r][c].colour !== pawn.colour
        )
            moves.push([r + 1, c + 1, "capture"]);
    }
    return moves;
    // FIXME: Handle these
    // en-passsant
    // promotions
}

/** @param {[number, number][]} direction
 * @param {ChessBoardMatrix} board
 * @param {number} row
 * @param {number} col
 * @returns {[number, number, string][]} moves
 * */
function calculateMoves(direction, board, row, col, limitDepth = false) {
    // FIXME:
    // 1. Pinned pieces
    // 2. Kings not being able to move to an attacked square.
    let moves = [];
    direction.forEach(([dr, dc]) => {
        let r = row + dr,
            c = col + dc;
        while (r < 8 && c < 8 && r >= 0 && c >= 0) {
            if (board[r][c] !== null) {
                if (board[r][c].colour !== board[row][col].colour)
                    moves.push([r + 1, c + 1, "capture"]);
                break;
            }
            moves.push([r + 1, c + 1, "move"]);
            if (limitDepth) break;
            c += dc;
            r += dr;
        }
    });
    return moves;
}

/**
 * @param {ChessBoardMatrix} board
 * @param {number} row
 * @param {number} col
 * @returns {[number, number, string][]}
 * */
export function getLegalMoves(board, row, col) {
    const piece = board[row][col];

    if (!piece) return [];

    /** @type {[[number, number]]} */
    let directions = [];
    let limitDepth = false;
    switch (piece.type) {
        case "R":
            directions = straight;
            break;
        case "B":
            directions = diagonal;
            break;
        case "K":
        case "Q":
            directions = [...straight, ...diagonal];
            break;
        case "N":
            directions = knightMoves;
            break;
        case "P":
            return calculatePawnMoves(board, row, col);
        default:
            console.error("Unkown Piece Type", piece.type);
            return;
    }
    if (piece.type === "N" || piece.type === "K") limitDepth = true;

    return calculateMoves(directions, board, row, col, limitDepth);
}
/**
 * @param {ChessBoardMatrix} board
 * @param {number} fromCol
 * @param {number} fromRow
 * @param {number} toCol
 * @param {number} toRow
 * @returns {ChessBoardMatrix}
 */
export function makeMovesOnBoardMatrix(board, fromRow, fromCol, toRow, toCol) {
    const newBoard = board.map((row) => [...row]);

    const originalPiece = newBoard[fromRow][fromCol];
    if (!originalPiece) return newBoard;
    const updatedPiece = {
        ...originalPiece,
        rank: toRow + 1,
        file: toCol + 1,
    };

    newBoard[fromRow][fromCol] = null;
    newBoard[toRow][toCol] = updatedPiece;

    return newBoard;
}
