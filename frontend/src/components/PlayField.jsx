import ChessBoard from "./board/ChessBoard.jsx";
import Coordinate from "./board/Coordinate.jsx";
import Piece from "./board/Piece.jsx";
import { startingPosition } from "../utils/startingPosition.js";
import { useState } from "react";
import { FlippedContext } from "../contexts/FlippedContext.js";


function PlayField() {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <FlippedContext value={isFlipped}>
            <div className="playfield">
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
        </FlippedContext>
    )
}
export default PlayField;
