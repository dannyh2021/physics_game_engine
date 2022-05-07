import React from "react";
import { WebGLUtils } from "three";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.gl = null;
    }

    componentDidMount() {
        this.gl = this.canvasRef.current.getContext("webgl2");
        if(!this.gl) {
            console.log("No webgl2 context found.");
        }
        this.main();
    }

    componentWillUnmount() {
        // TODO: research how to clean up webgl?
    }

    main() {
        const gl = this.gl;

        /*let vertexShaderSource = 
        `#version 300 es

        // an attribute is an input(in) in a vertex shader.
        // It will receive data from a buffer
        in vec4 a_position;

        //all shaders have a main function
        void main() {
            // gl_Position is a special variable a vertex shader
            // is responsible for setting
            gl_Position = a_position;
        }
        `

        let fragmentShaderSource =
        `#version 300 es

        // fragment shaders don't have a default precision so we need
        // to pick one. highp is a good default. It means "high precision"
        precision highp float;

        // we need to declare an output for the fragment shader
        out vec4 outColor;

        void main() {
            // Just set the output to a constant reddish-purple
            outColor = vec4(1, 0, 0.5, 1);
        }
        `

        let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        let program = this.createProgram(gl, vertexShader, fragmentShader);

        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // three 2d points
        let positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(positionAttributeLocation);
        let size = 2;   // 2 components per iteration
        let type = gl.FLOAT;    // the data is 32bit floats
        let normalize = false;  // don't normalize the data
        let stride = 0;         // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;         // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        // tells WebGL the -1 +1 clip space maps to 0 <-> gl.canvas.width for x, 0 <-> gl.canvas.height for y.
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // execute GLSL program.
        let primitiveType = gl.TRIANGLES;
        offset = 0;
        let count = 3;
        gl.drawArrays(primitiveType, offset, count);

        this.setGeometry(this.gl);
        gl.drawArrays(gl.TRIANGLES, 0, 3);*/

        let vertexShaderSource =
        `#version 300 es
        in vec2 a_position;
        
        uniform mat3 u_matrix;
        
        out vec4 v_color;
        
        void main() {
          // Multiply the position by the matrix.
          gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        
          // Convert from clipspace to colorspace.
          // Clipspace goes -1.0 to +1.0
          // Colorspace goes from 0.0 to 1.0
          v_color = gl_Position * 0.5 + 0.5;
        }
        `;

        let fragmentShaderSource = 
        `#version 300 es
        
        precision highp float;

        in vec4 v_color;

        out vec4 outColor;

        void main() {
            outColor = v_color;
        }
        `;

        // second part: triangle with gradient
        let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        let program = this.createProgram(gl, vertexShader, fragmentShader);

        // look up where the vertex data needs to go.
        let positionLocation = gl.getAttribLocation(program, "a_position");

        // lookup uniforms
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");

        // Create set of attributes
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        // Create a buffer.
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        // Set Geometry.
        this.setGeometry(gl);

        // tell the position attribute how to pull data out of the curernt ARRAY_BUFFER
        gl.enableVertexAttribArray(positionLocation);
        let size = 2;
        let type = gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        let translation = [200, 150];
        let angleInRadians = 0;
        let scale = [1, 1];

        // Draw the scene.
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Compute the matrix
        /*let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);*/

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Set the matrix.
        // gl.uniformMatrix3fv(matrixLocation, false, matrix);

        // Draw the geometry.
        offset = 0;
        let count = 3;
        gl.drawArrays(gl.TRIANGLES, offset, count);
    }

    // Fill the buffer the values that define a triangle.
    setGeometry(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0, -100,
                150, 125,
                -175, 100]),
            gl.STATIC_DRAW);
    }

    // this function creates a shader, uploads the GLSL source, and compiles the shader
    createShader(gl, type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    // links the 2 shaders into a program
    createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    render() {
        return (
            <div className="graphics_playground">
                <h2>graphics playground page desu...</h2>
                <div id="canvas_container">
                    <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                </div>
            </div>
        );
    }
}