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
function calculatePawnMoves(board, row, col, enPassantSquare) {
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
        if (row === initRow && board[oneStep][col] === null) {
            moves.push([twoStep + 1, col + 1, "move"]);
        }
    }

    const [epRank, epFile] = enPassantSquare?.current;
    for (const dc of [-1, 1]) {
        const r = row + dr;
        const c = col + dc;
        if (!inBounds(r, c)) return;
        if (
            (board[r][c] !== null &&
                board[r][c].colour !== pawn.colour &&
                board[r][c].type !== "K") ||
            (r === epRank - 1 && c === epFile - 1)
        ) {
            moves.push([r + 1, c + 1, "capture"]);
        }
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
    let moves = [];
    direction.forEach(([dr, dc]) => {
        let r = row + dr,
            c = col + dc;
        while (inBounds(r, c)) {
            if (board[r][c] !== null) {
                if (
                    board[r][c].colour !== board[row][col].colour &&
                    board[r][c].type !== "K"
                ) {
                    moves.push([r + 1, c + 1, "capture"]);
                }
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
export function getLegalMoves(
    board,
    rank,
    file,
    oldKingCoord,
    enPassantSquare,
) {
    const row = rank - 1;
    const col = file - 1;
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
            break;
        default:
            console.error("Unkown Piece Type", piece.type);
            return;
    }
    if (piece.type === "N" || piece.type === "K") limitDepth = true;

    const moves =
        piece.type === "P"
            ? calculatePawnMoves(board, row, col, enPassantSquare)
            : calculateMoves(directions, board, row, col, limitDepth);
    let legals = [];

    // Simulation of each moves to check for checks
    // FIXME: Cut down number of moves to simluate by
    // using separate pinned piece logic
    for (const [fromR, fromC, type] of moves) {
        const newboard = makeMovesOnBoardMatrix(
            board,
            rank,
            file,
            fromR,
            fromC,
        );
        const ownKingCoord = piece.type === "K" ? [fromR, fromC] : oldKingCoord;
        if (!isInCheck(newboard, ownKingCoord))
            legals.push([fromR, fromC, type]);
    }
    return legals;
}
/**
 * @param {ChessBoardMatrix} board
 * @param {number} fromCol
 * @param {number} fromRow
 * @param {number} toCol
 * @param {number} toRow
 * @returns {ChessBoardMatrix}
 */
export function makeMovesOnBoardMatrix(
    board,
    fromRank,
    fromFile,
    toRank,
    toFile,
    enPassantSquare,
) {
    const fromRow = fromRank - 1,
        fromCol = fromFile - 1,
        toRow = toRank - 1,
        toCol = toFile - 1;
    const newBoard = board.map((row) => [...row]);

    // FIXME: Clear the pawn on enpassant capture
    const originalPiece = newBoard[fromRow][fromCol];
    if (!originalPiece) return newBoard;
    const updatedPiece = {
        ...originalPiece,
        rank: toRow + 1,
        file: toCol + 1,
    };

    if (enPassantSquare?.current) {
        const dir = originalPiece.colour === "b" ? -1 : 1;
        if (originalPiece.type === "P" && toRow === fromRow + 2 * dir) {
            enPassantSquare.current = [+fromRank + dir, +toFile];
        } else {
            enPassantSquare.current = [];
        }
    }
    newBoard[fromRow][fromCol] = null;
    newBoard[toRow][toCol] = updatedPiece;

    return newBoard;
}

/**
 * @param {ChessBoardMatrix} board
 * @param {'w' | 'b'} colour
 * @returns {boolean}
 */
export function isInCheck(board, [rank, file]) {
    // DFS from coords of king in question and find if opposing piece in any valid direction
    const row = rank - 1;
    const col = file - 1;
    const king = board[row][col];
    if (king === null || king.type !== "K") throw new Error("Not king");
    const colour = king.colour;

    const opPawnDir = colour === "b" ? -1 : 1;
    // Pawn, King
    for (const [dr, dc] of [...straight, ...diagonal]) {
        const r = row + dr,
            c = col + dc;
        if (!inBounds(r, c)) continue;
        const piece = board[r][c];
        const pawnCheck =
            dr === opPawnDir &&
            (dc === 1 || dc === -1) &&
            piece?.colour !== colour &&
            piece?.type === "P";
        if (piece?.type === "K" || pawnCheck) {
            return true;
        }
    }
    // Queen, Rook, Bishops
    const sliding = [
        { dirs: straight, types: new Set(["R", "Q"]) },
        { dirs: diagonal, types: new Set(["B", "Q"]) },
    ];
    for (const { dirs, types } of sliding) {
        for (const [dr, dc] of dirs) {
            let r = row + dr,
                c = col + dc;
            while (inBounds(r, c)) {
                const piece = board[r][c];
                if (piece !== null) {
                    if (piece.colour !== colour && types.has(piece.type))
                        return true;
                    break;
                }
                c += dc;
                r += dr;
            }
        }
    }

    // Knight
    for (const [dr, dc] of knightMoves) {
        const r = row + dr,
            c = col + dc;
        if (
            inBounds(r, c) &&
            board[r][c]?.colour !== colour &&
            board[r][c]?.type === "N"
        )
            return true;
    }

    return false;
}
