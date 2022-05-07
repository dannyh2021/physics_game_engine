import React from "react";
import { GraphicsEngine } from "../graphics_engine/GraphicsEngine.ts";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;

export default class GraphicsPlayground2 extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.graphicsEngine = null;
    }

    componentDidMount() {
        let gl = this.canvasRef.current.getContext("webgl2");
        if(!this.gl) {
            console.log("No webgl2 context found.");
        }
        this.graphicsEngine = new GraphicsEngine(gl);
        this.main();
    }

    main() {
        this.graphicsEngine.print();
        this.graphicsEngine.draw();
    }

    render() {
        return (
            <div className="graphics_playground_2">
                <h2>graphics playground 2 page desu...</h2>
                <div id="canvas_container">
                    <canvas
                    ref={this.canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onMouseDown={(e) => this.graphicsEngine.onClick(e, this.canvasRef.current)}>
                        Please use a browser that supports "canvas".
                    </canvas>
                </div>
            </div>
        );
    }
}