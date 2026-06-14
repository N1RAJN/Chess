import { useState } from "react";
import { initBoard } from "../utils/chessEngine";

export function useChessGame() {
    const [board, setBoard] = useState(initBoard());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [activeHighlights, setActiveHighlights] = useState([]);

    const handleClick = (rank, file) => {
        const row = rank - 1;
        const col = file - 1;
        if (selectedSquare) {
        } else {
            const piece = board[row][col];
            if (piece) {
                setSelectedSquare([row, col]);
            }
        }
    };
    return [board, selectedSquare, activeHighlights, handleClick];
}
