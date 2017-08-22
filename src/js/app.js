/*
 * @title App
 * @description Application entry point
 */


/*********************************************************************************
 1. DEPENDENCIES
 *********************************************************************************/

import p5 from 'p5';
import { World } from './components/evolution';
import * as render from './components/render';
import * as setup from './components/setup';

const width = 1080;
const height = 1920;
const fps = 20;
var world = new World({
    width: width,
    height: height,
    fps: fps
});
var sketch = (p) => {
    p.setup = () => {
        var canvas = p.createCanvas(width, height);
        canvas.parent('#main-canvas');
        setup.setupWorld(world);
        console.log('Initialized.');
    };

    p.draw = () => {
        p.background(10);
        p.stroke(4);
        world.agents.forEach(agent => {
            agent.update(world);
        });
        world.agents.forEach(agent => {
            render.drawAgent(p, agent);
        });
    };
};

var myP5 = new p5(sketch);
