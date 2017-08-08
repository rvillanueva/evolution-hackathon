/*
 * @title App
 * @description Application entry point
 */


/*********************************************************************************
 1. DEPENDENCIES
 *********************************************************************************/

import P5 from 'p5';
import { World } from './components/evolution';
import * as render from './components/render';
import * as setup from './components/setup';

var world = new World();

var fn = (p) => {
    p.setup = () => {
        var canvas = p5.createCanvas(500, 500);
        canvas.parent('#main-canvas');
        setup.setupWorld(world);
        console.log('Initialized.');
    };

    p.draw = () => {
        p.background(205);
        p.stroke(4);
        world.agents.forEach(agent => {
            render.drawAgent(p, agent);
        });
    };
};

var p5 = new P5(fn);
