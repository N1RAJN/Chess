import { pieceSVG } from "../../utils/pieceSVG";
import { useContext } from "react";
import { FlippedContext } from "../../contexts/FlippedContext";

function Piece({ type, rank, file }) {
    const isFlipped = useContext(FlippedContext);
    let row = isFlipped ? rank - 1 : 8 - rank;
    let column = isFlipped ? 8 - file : file - 1;

    const style = { position: 'absolute', top: `${row * 12.5}%`, left: `${column * 12.5}%` }
    return (<div id={`${type}-${file}${rank}`} className="piece" style={style}>
        <img src={pieceSVG[type]} />
    </div>)
}
export default Piece;
