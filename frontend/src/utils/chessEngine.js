import { knightMoves, pawnMoves, straight, diagonal } from "./moveDirections";
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
 * @returns {[number, number][]} moves
 * */
function calculatePawnMoves(board, row, col) {
    /**@type {ChessPiece}*/
    const pawn = board[row][col];
    if (pawn.type !== "P") throw new Error("Not a pawn");

    const initRow = pawn.colour === "w" ? 1 : 6;

    const moves = [];
    for (const moveType in pawnMoves) {
        if (row !== initRow && moveType == "twoSquares") continue;

        const [dr, dc] = pawnMoves[moveType];
        const r = row + dr;
        const c = col + dc;

        if (r >= 8 || c >= 8 || r < 0 || c < 0) continue;
        if (board[r][c] !== null) continue;

        if (moveType === "leftCapture" || moveType === "rightCapture") {
            if (board[r][c] !== null && board[r][c]?.colour !== pawn.colour)
                moves.push([r + 1, c + 1]);
            continue;
        }
        moves.push([r + 1, c + 1]);
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
 * @returns {[number, number][]} moves
 * */
function calculateMoves(direction, board, row, col, limitDepth = false) {
    let moves = [];
    direction.forEach(([dr, dc]) => {
        let r = row + dr,
            c = col + dc;
        while (r < 8 && c < 8 && r >= 0 && c >= 0) {
            if (board[r][c] !== null) {
                if (board[r][c].colour !== board[row][col].colour)
                    moves.push([r + 1, c + 1]);
                break;
            }
            moves.push([r + 1, c + 1]);
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
 * @returns {[number, number][]}
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
 */
