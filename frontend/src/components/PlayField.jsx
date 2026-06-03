import ChessBoard from "./board/ChessBoard.jsx";
import Coordinate from "./board/Coordinate.jsx";
function PlayField() {
    return (<div className="playfield">
        <ChessBoard key={"chessboard"}></ChessBoard>
        <Coordinate key={"coordinate-rank"} axis={"rank"}></Coordinate>
        <Coordinate key={"coordinate-file"} axis={"file"}></Coordinate>
    </div>)
}
export default PlayField;
