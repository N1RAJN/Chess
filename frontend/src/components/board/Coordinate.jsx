function Coordinate({ axis }) {
    return (
        <div className={`coordinate-container ${axis}`}>
            {Array.from({ length: 8 }, (_, index) => {
                let color = (axis == "rank" ? index : index + 1) % 2 ? "light" : "dark";
                let coords = axis == "file" ? String.fromCharCode(index + 97) : 8 - index;
                return (<div className={`coordinate ${color}`}>
                    {coords}
                </div>)
            })}
        </div>
    );
}
export default Coordinate;
