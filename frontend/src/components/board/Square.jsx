function Square({ color, rank, file }) {
    return (<div id={`square-${file}${rank}`} className={`square ${color}`}>
    </div>)
}
export default Square;
