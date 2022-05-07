import { Vector3 } from "./math_library/Vector3";

let v = new Vector3(1, 1, 3);

console.log(v.x);
console.log(v.y);
console.log(v.z);

console.log("magnitude", v.magnitude());
console.log("squared magnitude", v.squaredMagnitude());

v.normalize();
console.log("normalized magnitude", v.magnitude());
console.log("new x", v.x);
console.log("new y", v.y);
console.log("new z", v.z);

console.log("toString", v);