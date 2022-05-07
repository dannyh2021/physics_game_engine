// shaders works
const VERTEX_SHADER_SOURCE =
`#version 300 es

void main() {
    gl_Position = vec4(0.5, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
}
`;

const FRAGMENT_SHADER_SOURCE =
`#version 300 es

precision highp float;

out vec4 fragColor;
void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

        let vertexShader = compileShader(gl, VERTEX_SHADER_2_SOURCE, gl.VERTEX_SHADER);
        let fragmentShader = compileShader(gl, FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
        let program = createProgram(gl, vertexShader, fragmentShader);
        this.program = program;

        // Tell WebGL to use our program
        gl.useProgram(program);

        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        if (positionAttributeLocation < 0) {
            console.log("Failed to get the storage location of a_position");
            return;
        }

        // Pass the vertex position to attribute variable
        gl.vertexAttrib3f(positionAttributeLocation, 0.5, 0.0, 0.0);
        
        // Set the color for clearing <canvas> and clear <canvas>
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
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
 * @param {!WebGL2RenderingContext} gl The WebGL context.
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
 * @param {!WebGL2RenderingContext} gl The WebGL context.
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