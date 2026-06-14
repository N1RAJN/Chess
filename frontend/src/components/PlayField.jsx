import ChessBoard from "./board/ChessBoard.jsx";
import Coordinate from "./board/Coordinate.jsx";
import Piece from "./board/Piece.jsx";
import { startingPosition } from "../utils/startingPosition.js";
import { useState } from "react";
import { FlippedContext } from "../contexts/FlippedContext.js";
import { useChessGame } from "../hooks/useChessGame.js";


function PlayField() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [board, selectedSquare, activeHighlights, handleClick] = useChessGame();

    function processClick(e) {
        e.preventDefault();
        let square;
        if (e.target.nodeName === "IMG")
            square = e.target.parentElement.id.split("-");
        else
            square = e.target.id.split("-");

        handleClick(square[1][1], square[1][0])
    }
    return (
        <FlippedContext value={isFlipped}>
            <div className="playfield" onPointerDown={(e) => {
                processClick(e)
            }}>
                <ChessBoard key={"chessboard"} />
                <Coordinate key={"coordinate-rank"} axis={"rank"} />
                <Coordinate key={"coordinate-file"} axis={"file"} />

                <div className="pieces-layer">
                    {startingPosition.map(([type, file, rank]) => {
                        return (<Piece type={type} rank={rank} file={file} ></Piece>)
                    })}
                </div>
            </div >
            <button onClick={() => { setIsFlipped(!isFlipped) }}>flip</button>
        </FlippedContext >
    )
}
export default PlayField;
