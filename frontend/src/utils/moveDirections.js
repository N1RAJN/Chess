export const straight = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];
export const diagonal = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
];
export const knightMoves = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
];
export const pawnMoves = {
    oneSquare: [1, 0],
    twoSquares: [2, 0],
    rightCapture: [1, -1],
    leftCapture: [1, -1],
};
