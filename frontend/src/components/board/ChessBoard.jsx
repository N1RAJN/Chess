import { useContext } from "react";
import { FlippedContext } from "../../contexts/FlippedContext.js";
import Square from "./Square.jsx";

function ChessBoard() {
    const isFlipped = useContext(FlippedContext);
    const boardState = isFlipped ? "flipped" : "";

    return (
        <div className={`chessboard ${boardState}`}>
            {Array.from({ length: 8 }, (_, row) => {
                // White on bottom: ranks start from 1-8, bottom-to-top
                let rank = 8 - row;
                return <div key={`rank-${rank + 1}`} id={`rank-${rank + 1}`} className="rank">
                    {Array.from({ length: 8 }, (_, column) => {
                        // column starts from 0
                        // ASCII of 'a' = 97
                        let file = String.fromCharCode(column + 97);

                        // Eyeballed it and works somehow
                        let color = (row + column) % 2 ? "dark" : "light";
                        return (<Square key={`square-${file}${rank}`} color={color} rank={rank} file={file}></Square>);
                    })}
                </div>
            })}
        </div>
    )
};
export default ChessBoard;
