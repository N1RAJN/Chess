import Square from "./Square.jsx";
const ChessBoard = () => {
    return (<div className="chessboard">
        {Array.from({ length: 8 }, (_, row) => {
            // White on bottom: ranks start from 1-8, bottom-to-top
            let rank = 8 - row;
            return <div key={`rank-${rank + 1}`} id={`rank-${rank + 1}`} className="rank">
                {Array.from({ length: 8 }, (_, column) => {
                    // column starts from 0
                    // ASCII of 'a' = 96
                    let file = String.fromCharCode(column + 1 + 96);

                    // Eyeballed it and works somehow
                    let color = (row + column) % 2 ? "dark" : "light";
                    return (<Square key={`square-${file}${rank}`} color={color} rank={rank} file={file}></Square>);
                })}
            </div>
        })}
    </div>)
};
export default ChessBoard;
