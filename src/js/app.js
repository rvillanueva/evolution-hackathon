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
        p.background(255);
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

setInterval(() => {
  writeLog();
}, 200)

function writeLog(){
  var agentCount = 0;
  var index = {};
  var keys = [];
  world.agents.map(agent => {
    agentCount ++;
    agent.dna.genes.map(gene =>{
      if(keys.indexOf(gene.key) === -1){
        keys.push(gene.key);
      }
      index[gene.key] = index[gene.key] || {
        total: 0,
        count: 0
      }
      index[gene.key].total += gene.value;
      index[gene.key].count ++;
    })
  })
  var str = '';
  keys.map(key => {
    var average = Math.floor(index[key].total/index[key].count * 100)/100;
    str += `<p>${key}: ${average}</p>`
  })
  document.getElementById('ev-log').innerHTML = str;
}
