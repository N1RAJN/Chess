import { useState } from "react";
import {
    initBoard,
    getLegalMoves,
    makeMovesOnBoardMatrix,
} from "../utils/chessEngine";

export function useChessGame() {
    const [board, setBoard] = useState(initBoard());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [activeHighlights, setActiveHighlights] = useState([]);

    const handleClick = (rank, file) => {
        const row = rank - 1;
        const col = file - 1;
        const piece = board[row][col];
        const selected = selectedSquare
            ? board[selectedSquare[0] - 1][selectedSquare[1] - 1]
            : null;
        if (selected && piece === selected) {
            setSelectedSquare(null);
            setActiveHighlights([]);
        } else if (piece && (!selected || piece.colour == selected.colour)) {
            setSelectedSquare([rank, file]);
            setActiveHighlights(getLegalMoves(board, row, col));
        } else {
            const isLegal = activeHighlights.some(
                ([r, c]) => r == rank && c == file,
            );

            if (isLegal) {
                const [fromRank, fromFile] = selectedSquare;
                const newBoard = makeMovesOnBoardMatrix(
                    board,
                    fromRank - 1,
                    fromFile - 1,
                    row,
                    col,
                );
                setBoard(newBoard);
                setSelectedSquare(null);
                setActiveHighlights([]);
            }
        }
    };
    return [board, selectedSquare, activeHighlights, handleClick];
}
