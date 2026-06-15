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

/** @param {[number, number][]} direction
 * @param {ChessBoardMatrix} board
 * @param {number} row
 * @param {number} col
 *  @returns {[number, number][]} moves
 * */
function calculateMoves(direction, board, row, col) {
    // FIXME: single depth for knight and king
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
    let moves = [];
    switch (piece.type) {
        case "R":
            moves = calculateMoves(straight, board, row, col);
            break;
        case "B":
            moves = calculateMoves(diagonal, board, row, col);
            break;
        case "Q":
            moves = calculateMoves(straight, board, row, col);
            moves = moves.concat(calculateMoves(diagonal, board, row, col));
            break;
        case "N":
            moves = calculateMoves(knightMoves, board, row, col);
            break;
        case "K":
            moves = calculateMoves(straight, board, row, col);
            moves = moves.concat(calculateMoves(diagonal, board, row, col));
            break;
        case "P":
            // 1 square up
            // 2 square up (if starting rank)
            // diagonal captures
            // en-passsant
            // promotions
            break;
        default:
            console.error("Unkown Piece Type", piece.type);
    }
    return moves;
}

/**
 */
