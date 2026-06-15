import { useState } from "react";
import { initBoard, getLegalMoves } from "../utils/chessEngine";

export function useChessGame() {
    const [board, setBoard] = useState(initBoard());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [activeHighlights, setActiveHighlights] = useState([]);

    const handleClick = (rank, file) => {
        const row = rank - 1;
        const col = file - 1;
        const piece = board[row][col];
        if (selectedSquare) {
            let [sR, sC] = selectedSquare;
            if (piece?.colour == board[sR][sC].colour) setSelectedSquare(null);
        } else {
            if (piece) {
                setSelectedSquare([row, col]);
                console.log(getLegalMoves(board, row, col));
            }
        }
    };
    return [board, selectedSquare, activeHighlights, handleClick];
}
