import { useContext } from "react";
import { FlippedContext } from "../../contexts/FlippedContext";

function Coordinate({ axis }) {
    const isFlipped = useContext(FlippedContext);
    return (
        <div className={`coordinate-container ${axis}`}>
            {Array.from({ length: 8 }, (_, index) => {
                let color = (axis == "rank" ? index : index + 1) % 2 ? "light" : "dark";

                const rank = isFlipped ? index + 1 : 8 - index;
                const file = isFlipped ? (7 - index) + 97 : index + 97;
                let coords = axis == "file" ? String.fromCharCode(file) : rank;
                return (<div className={`coordinate ${color}`}>
                    {coords}
                </div>)
            })}
        </div>
    );
}
export default Coordinate;
