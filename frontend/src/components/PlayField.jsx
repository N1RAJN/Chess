import ChessBoard from "./board/ChessBoard.jsx";
import Coordinate from "./board/Coordinate.jsx";
import { startingposition } from "../utils/startingPosition.js";
import Piece from "./board/Piece.jsx";
function PlayField() {
    return (<div className="playfield">
        <ChessBoard key={"chessboard"}></ChessBoard>
        <Coordinate key={"coordinate-rank"} axis={"rank"}></Coordinate>
        <Coordinate key={"coordinate-file"} axis={"file"}></Coordinate>
        <div className="pieces-layer">
            {startingposition.map(([type, file, rank]) => {
                return (<Piece type={type} rank={rank} file={file} ></Piece>)
            })}
        </div>
    </div >)
}
export default PlayField;
