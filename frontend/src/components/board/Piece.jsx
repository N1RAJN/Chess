import { pieceSVG } from "../../utils/pieceSVG";
function Piece({ type, rank, file }) {
    let row = 8 - rank;
    let column = file - 1;
    const style = { position: 'absolute', top: `${row * 12.5}%`, left: `${column * 12.5}%` }
    return (<div className="piece" style={style}>
        <img src={pieceSVG[type]} />
    </div>)
}
export default Piece;
