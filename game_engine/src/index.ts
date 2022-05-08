import Vector3 from "./math_library/Vector3";
import Matrix4 from "./math_library/Matrix4";
import * as LinearAlgebra from "./math_library/LinearAlgebra";

const matrix = LinearAlgebra.orthographicProjectionMatrix4(-20, 20, -20, 20, -20, 20);

let testVectors = [];

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 5; k++) {
            testVectors.push(new Vector3(i * 10 - 20, j * 10 - 20, k * 10 - 20));
        }
    }
}

console.log(matrix);

for (let i = 0; i < testVectors.length; i++) {
    console.log("testVector:", testVectors[i], " projected to: ", LinearAlgebra.multiplyMatrix4AndVector3(matrix, testVectors[i]));
}