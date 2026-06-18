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
            setSelectedSquare(null);
            setActiveHighlights([]);
        }
    };
    return [board, selectedSquare, activeHighlights, handleClick];
}
