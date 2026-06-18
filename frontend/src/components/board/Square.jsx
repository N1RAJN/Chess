function Square({ color, rank, file, style, isLastMove = false, isCheck = false, isLegalMove = false, isCapture = false, isSelected = false }) {

    const baseClass = `square ${color ?? ""}`;
    const highlightClasses = [];

    if (isLastMove) highlightClasses.push("highlight-last-move");
    if (isLegalMove) highlightClasses.push("highlight-move");
    if (isCheck) highlightClasses.push("highlight-check");
    if (isCapture) highlightClasses.push("highlight-capture");
    if (isSelected) highlightClasses.push("highlight-selected");

    let finalClass = `${baseClass} ${highlightClasses.join(' ')}`.trim();
    let id = `square-${file}${rank}`;
    if (highlightClasses.length !== 0) id += " highlight";

    return (<div id={id} className={finalClass} style={style} >
    </div >)
}
export default Square;
