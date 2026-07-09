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
    const enPassantSquare = useRef([]);
    const [board, setBoard] = useState(initBoard());
    const [isWhiteToMove, setIsWhiteToMove] = useState(true);
    const [checkedSquare, setCheckedSquare] = useState(null);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [activeHighlights, setActiveHighlights] = useState([]);

    const handleClick = (rank, file) => {
        const row = +rank - 1;
        const col = +file - 1;
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
            if (isWhiteToMove ^ (piece.colour === "w")) return;

            setSelectedSquare([rank, file]);
            let oldKingCoord = isWhiteToMove
                ? whiteKing.current
                : blackKing.current;

            setActiveHighlights(
                getLegalMoves(board, rank, file, oldKingCoord, enPassantSquare),
            );
        }
        // Move a selected piece
        else {
            const isLegal = activeHighlights.some(
                ([r, c]) => r == rank && c == file,
            );

            if (!isLegal) return;

            const [fromRank, fromFile] = selectedSquare;

            const newBoard = makeMovesOnBoardMatrix(
                board,
                fromRank,
                fromFile,
                rank,
                file,
                enPassantSquare,
            );
            const opposingKingCoord = isWhiteToMove
                ? blackKing.current
                : whiteKing.current;

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
