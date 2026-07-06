import { useState } from "react";
import { useRef } from "react";
import {
    initBoard,
    getLegalMoves,
    makeMovesOnBoardMatrix,
    isInCheck,
} from "../utils/chessEngine";

export function useChessGame() {
    const whiteKing = useRef([1, 5]); // Rank, file
    const blackKing = useRef([8, 5]);
    const [board, setBoard] = useState(initBoard());
    const [isWhiteToMove, setIsWhiteToMove] = useState(true);
    const [checkedSquare, setCheckedSquare] = useState(null);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [activeHighlights, setActiveHighlights] = useState([]);

    const handleClick = (rank, file) => {
        const row = rank - 1;
        const col = file - 1;
        const piece = board[row][col];
        const selected = selectedSquare
            ? board[selectedSquare[0] - 1][selectedSquare[1] - 1]
            : null;

        // Unselect by clicking selected piece
        if (selected && piece === selected) {
            setSelectedSquare(null);
            setActiveHighlights([]);
        }
        // Select a piece
        else if (piece && (!selected || piece.colour == selected.colour)) {
            // Turn checking
            if (!isWhiteToMove ^ (piece.colour === "b")) return;

            setSelectedSquare([rank, file]);
            const moves = getLegalMoves(board, row, col);
            // FIX: Perhaps not even show moves that don't evade checks
            setActiveHighlights(moves);
        }
        // Move a selected piece
        else {
            const isLegal = activeHighlights.some(
                ([r, c]) => r == rank && c == file,
            );

            if (!isLegal) return;

            // Clicked one of the highlighted square
            const [fromRank, fromFile] = selectedSquare;
            const newBoard = makeMovesOnBoardMatrix(
                board,
                fromRank - 1,
                fromFile - 1,
                row,
                col,
            );
            const opposingKingCoord = isWhiteToMove
                ? blackKing.current
                : whiteKing.current;
            let ownKingCoord =
                selected.type === "K"
                    ? [rank, file]
                    : isWhiteToMove
                      ? whiteKing.current
                      : blackKing.current;

            // Does move result in own king in check ?
            if (isInCheck(newBoard, ownKingCoord)) return;

            // Update coords if king
            if (selected.type === "K") {
                if (isWhiteToMove) whiteKing.current = [rank, file];
                else blackKing.current = [rank, file];
            }
            // Check if move resulted in check
            if (isInCheck(newBoard, opposingKingCoord)) {
                setCheckedSquare(opposingKingCoord);
            } else {
                setCheckedSquare(null);
            }

            setIsWhiteToMove(!isWhiteToMove);
            setBoard(newBoard);
            setSelectedSquare(null);
            setActiveHighlights([]);
        }
    };
    return [
        board,
        isWhiteToMove,
        checkedSquare,
        selectedSquare,
        activeHighlights,
        handleClick,
    ];
}
