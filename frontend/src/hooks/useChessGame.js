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
        if (selected && piece === selected) {
            setSelectedSquare(null);
            setActiveHighlights([]);
        } else if (piece && (!selected || piece.colour == selected.colour)) {
            setSelectedSquare([rank, file]);
            const moves = getLegalMoves(board, row, col);
            setActiveHighlights(moves);
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
                const coords =
                    selected.colour === "b"
                        ? whiteKing.current
                        : blackKing.current;
                if (selected.type === "K") {
                    if (selected.colour === "w")
                        whiteKing.current = [rank, file];
                    else blackKing.current = [rank, file];
                } else {
                    if (isInCheck(newBoard, coords)) {
                        setCheckedSquare(coords);
                    }
                }
                setBoard(newBoard);
                setSelectedSquare(null);
                setActiveHighlights([]);
            }
        }
    };
    return [
        board,
        checkedSquare,
        selectedSquare,
        activeHighlights,
        handleClick,
    ];
}
