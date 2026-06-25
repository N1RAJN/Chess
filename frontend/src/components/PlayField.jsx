import ChessBoard from "./board/ChessBoard.jsx";
import Coordinate from "./board/Coordinate.jsx";
import Piece from "./board/Piece.jsx";
import Square from "./board/Square.jsx";
import { useState } from "react";
import { FlippedContext } from "../contexts/FlippedContext.js";
import { useChessGame } from "../hooks/useChessGame.js";

// NOTE: Square (and piece) coordinates are marked as file-rank (colum-row)
// Range: [1, 8]

// NOTE: Whereas, board state (2D-array) uses row-column
// Range: [0, 7]

function PlayField() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [board, checkedSquare, selectedSquare, activeHighlights, handleClick] = useChessGame();

    function processClick(e) { // Find the square coords
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
                <div className={`highlights-layer ${isFlipped ? "flipped" : ""}`}>
                    {checkedSquare && (<Square
                        key={`highlight-${checkedSquare.join("-")}`}
                        rank={checkedSquare[0]}
                        file={checkedSquare[1]}
                        isCheck={true}
                        style={{ "--rank": checkedSquare[0], "--file": checkedSquare[1] }}
                    />)}
                    {selectedSquare && (<Square
                        key={`highlight-${selectedSquare.join("-")}`}
                        rank={selectedSquare[0]}
                        file={selectedSquare[1]}
                        isSelected={true}
                        style={{ "--rank": selectedSquare[0], "--file": selectedSquare[1] }}
                    />)}
                    {activeHighlights?.map(([rank, file, type]) => {
                        return (<Square
                            key={`highlight-${type}-${file}-${rank}`}
                            rank={rank}
                            file={file}
                            style={{ '--rank': rank, '--file': file }}
                            isCapture={type === "capture" ? true : false}
                            isCheck={type === "check" ? true : false}
                            isLegalMove={type === "move" ? true : false} />)
                    })}

                </div>
                <Coordinate key={"coordinate-rank"} axis={"rank"} />
                <Coordinate key={"coordinate-file"} axis={"file"} />

                <div className="pieces-layer">
                    {board.map((row, _) =>
                        row.map((piece, _) => {
                            if (!piece) return null;
                            return (<Piece
                                key={piece.id}
                                colour={piece.colour}
                                type={piece.type}
                                rank={piece.rank}
                                file={piece.file}
                                style={{ '--rank': piece.rank, '--file': piece.file }}
                            ></Piece>)
                        })
                    )}
                </div>
            </div >
            <button onClick={() => { setIsFlipped(!isFlipped) }}>flip</button>
        </FlippedContext >
    )
}
export default PlayField;
