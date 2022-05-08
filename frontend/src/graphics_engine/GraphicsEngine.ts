import Matrix4 from "../math_library/Matrix4";
import * as LinearAlgebra from "../math_library/LinearAlgebra";

const VERTEX_SHADER_SOURCE =
`#version 300 es

in vec4 a_position;

// A matrix to transform the position by
uniform mat4 u_matrix;

void main() {
    // Multiply the position by the matrix.
    gl_Position = u_matrix * a_position;
}
`;

const FRAGMENT_SHADER_SOURCE =
`#version 300 es

precision highp float;
uniform vec4 u_color;

out vec4 outColor;
void main() {
    outColor = u_color;
}
`;

// shaders for testing
const VERTEX_SHADER_2_SOURCE =
`#version 300 es

// an attribute is an input(in) to a vertex shader.
// It will receive data from a buffer.
in vec4 a_position;
void main() {
    gl_Position = a_position;
    gl_PointSize = 10.0;
}
`;

export class GraphicsEngine {
    private g_points = [];
    private program = null;
    constructor(private gl: WebGL2RenderingContext) {}

    print(): void {
        console.log("graphics engine print", this.gl);
    }

    draw(): void {
        const gl = this.gl

        // compile shaders, create program and use program
        let program = initProgramFromSources(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);

        // look up where the attribute and uniform locations
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let colorAttributeLocation = gl.getUniformLocation(program, "u_color");
        let matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

        // Create a buffer
        let positionBuffer = gl.createBuffer();

        // create a vertex array object (attribute state) and make it the one we're currently working with
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind it to ARRAY_BUFFER (this of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Fill the current ARRAY_BUFFER buffer
        // with the values that define a letter 'F'.
        setGeometry(gl);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 3;           // 3 components per iteration
        let type = gl.FLOAT;    // the data is 32bit floats
        let normalize = false;  // don't normalize the data
        let stride = 0;         // 0 = move forward size * sizeof(type) each iteration to get the next position.
        let offset = 0;         // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        // Create the color buffer, make it the current ARRAY_BUFFER and copy in the color values
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        setColors(gl);

        // Turn on the attribute
        gl.enableVertexAttribArray(colorAttributeLocation);

        // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

        function degToRad(degrees: number) {
            return degrees * Math.PI / 180;
        }

        let translations = [500, 200, 0];
        let rotation = [degToRad(40), degToRad(25), degToRad(325)];
        let scale = [1, 1, 1];

        // Draw the scene.
        
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

        // Compute the matrix
        let projectionMatrix = projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
        let translationMatrix = translation(translations[0], translations[1], translations[2]);
        let matrix = multiply(projectionMatrix, translationMatrix);

        // Set the matrix
        gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

        // Draw the geometry.
        let primitiveType = gl.TRIANGLES;
        offset = 0;
        let count = 16 * 6;
        gl.drawArrays(primitiveType, offset, count);

        console.log("clientWidth", gl.canvas.clientWidth);
        console.log("canvas width", gl.canvas.width);
        console.log("matrix:", matrix);
    }

    onClick(e: MouseEvent, canvas: HTMLCanvasElement) {
        let positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        console.log("positionAttributeLocation", positionAttributeLocation);
        this.click(e, this.gl, canvas, positionAttributeLocation);
    }

    click(e: MouseEvent, gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, a_position: number): void {
        console.log("mouse clicked");
        let x = e.clientX; // x coordinate of a mouse pointer
        let y = e.clientY;
        let rect = (e.target as HTMLElement).getBoundingClientRect();

        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        console.log("x", x, "y", y, "rect", rect);

        // Store the coordinates into g_points array
        this.g_points.push(x); this.g_points.push(y);

        console.log("g_points", this.g_points);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        for(let i = 0; i < this.g_points.length; i += 2) {
            // Pass the position of a point to a_Position variable
            gl.vertexAttrib3f(a_position, this.g_points[i], this.g_points[i+1], 0.0);

            // Draw a point
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}

/**
 * Creates and compiles a shader.
 * 
 * @param {!WebGL2RenderingContext} gl The WebGL2 context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl: WebGL2RenderingContext, shaderSource: string, shaderType: number): WebGLShader {
    // Create the shader object
    let shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        // Something went wrong during compilation; get the error
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
}

/** 
 * Creates a program from 2 shaders.
 * 
 * @param {!WebGL2RenderingContext} gl The WebGL2 context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    // create a program.
    let program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        throw("program failed to link" + gl.getProgramInfoLog(program));
    }

    return program;
}

/**
 * Compiles vertex shader and fragment shader from sources. Creates and uses the program. Returns the program.
 * 
 * @param {!WebGL2RenderingContext} gl The WebGL2 context.
 * @param {!string} vertexShaderSource The GLSL source code for the vertex shader.
 * @param {!string} fragmentShaderSource The GLSL source code for the fragment shader.
 * @return {!WebGLProgram} The program created.
 */
function initProgramFromSources(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
    let vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    let program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    return program;
}

// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry(gl: WebGL2RenderingContext) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            0, 0, 0,
            30, 0, 0,
            0, 150, 0,
            0, 150, 0,
            30, 0, 0,
            30, 150, 0,

            // top rung front
            30, 0, 0,
            100, 0, 0,
            30, 30, 0,
            30, 30, 0,
            100, 0, 0,
            100, 30, 0,

            // middle rung front
            30, 60, 0,
            67, 60, 0,
            30, 90, 0,
            30, 90, 0,
            67, 60, 0,
            67, 90, 0,

            // left column back
            0, 0, 30,
            30, 0, 30,
            0, 150, 30,
            0, 150, 30,
            30, 0, 30,
            30, 150, 30,

            // top rung back
            30, 0, 30,
            100, 0, 30,
            30, 30, 30,
            30, 30, 30,
            100, 0, 30,
            100, 30, 30,

            // middle rung back
            30, 60, 30,
            67, 60, 30,
            30, 90, 30,
            30, 90, 30,
            67, 60, 30,
            67, 90, 30,

            // top
            0, 0, 0,
            100, 0, 0,
            100, 0, 30,
            0, 0, 0,
            100, 0, 30,
            0, 0, 30,

            // top rung right
            100, 0, 0,
            100, 30, 0,
            100, 30, 30,
            100, 0, 0,
            100, 30, 30,
            100, 0, 30,

            // under top rung
            30, 30, 0,
            30, 30, 30,
            100, 30, 30,
            30, 30, 0,
            100, 30, 30,
            100, 30, 0,

            // between top rung and middle
            30, 30, 0,
            30, 30, 30,
            30, 60, 30,
            30, 30, 0,
            30, 60, 30,
            30, 60, 0,

            // top of middle rung
            30, 60, 0,
            30, 60, 30,
            67, 60, 30,
            30, 60, 0,
            67, 60, 30,
            67, 60, 0,

            // right of middle rung
            67, 60, 0,
            67, 60, 30,
            67, 90, 30,
            67, 60, 0,
            67, 90, 30,
            67, 90, 0,

            // bottom of middle rung.
            30, 90, 0,
            30, 90, 30,
            67, 90, 30,
            30, 90, 0,
            67, 90, 30,
            67, 90, 0,

            // right of bottom
            30, 90, 0,
            30, 90, 30,
            30, 150, 30,
            30, 90, 0,
            30, 150, 30,
            30, 150, 0,

            // bottom
            0, 150, 0,
            0, 150, 30,
            30, 150, 30,
            0, 150, 0,
            30, 150, 30,
            30, 150, 0,

            // left side
            0, 0, 0,
            0, 0, 30,
            0, 150, 30,
            0, 0, 0,
            0, 150, 30,
            0, 150, 0,
        ]),
        gl.STATIC_DRAW);
}

// Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
function setColors(gl: WebGL2RenderingContext) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([
            // left column front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // top rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // middle rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // left column back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // middle rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,

            // top rung right
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,

            // under top rung
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,

            // between top rung and middle
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,

            // top of middle rung
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,

            // right of middle rung
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,

            // bottom of middle rung.
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,

            // right of bottom
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,

            // bottom
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,

            // left side
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
        ]),
        gl.STATIC_DRAW);
}