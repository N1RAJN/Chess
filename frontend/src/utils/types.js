/** @typedef {'R' | 'N' | 'B' | 'K' | 'Q' | 'P'} PieceType

/**
 * @typedef {Object} ChessPiece
 * @property {'w' | 'b'} colour
 * @property {PieceType} type
 * @property {number} file
 * @property {number} rank
 * */

/**
 * @typedef {(ChessPiece | null)[][]} ChessBoardMatrix
 * */

/**
 * @typedef {"move", "capture", "check", "lastMove", "selected"} Highlight
 */
