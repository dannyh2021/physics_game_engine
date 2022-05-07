import React from "react";
import * as THREE from "three";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.renderer = null;
        this.scene = new THREE.Scene();
        this.animationRequestID = null;
    }

    componentDidMount() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.current, alpha: true});
        this.renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    componentWillUnmount() {
        // TODO: research how to clean up webgl / three js?
        if (this.renderer) {
            this.renderer = null;
        }
        this.scene = null;
        if (this.animationRequestID) {
            cancelAnimationFrame(this.animationRequsetID);
        }
    }

    render() {
        return (
            <div className="home">
                <h2>Home page desu...</h2>
                <div id="canvas_container">
                    <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                </div>
            </div>
        );
    }
}