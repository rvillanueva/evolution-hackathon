/*
 * @title App
 * @description Application entry point
 */


/*********************************************************************************
 1. DEPENDENCIES
 *********************************************************************************/

import P5 from 'p5';
//import World from './components/evolution/world';

//var world = new World();
var s = (p) => {

    p.setup = () => {
        var canvas = p5.createCanvas(500, 500);
        canvas.parent('#main-canvas');
        console.log('Initialized.');
    };

    p.draw = () =>{
        p.background(205);
        p.stroke(4);
    };
};

var p5 = new P5(s);
