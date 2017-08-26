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
import config from './config';

var world = new World({
    width: config.width,
    height: config.height,
    fps: config.fps
});
var sketch = (p) => {
    p.setup = () => {
        var canvas = p.createCanvas(config.width, config.height);
        canvas.parent('#main-canvas');
        setup.setupWorld(world);
        console.log('Initialized.');
    };

    p.draw = () => {
        p.background(255);
        p.stroke(4);
        world.energy = 10;
        world.agents.sort((a, b) => {
            return b.state.energy - a.state.energy;
        });
        var total = 0;
        world.agents.map(a => {
            total += (1 - a.traits.foodchain);
        });
        world.agents.forEach(a => {
            a.state.energy += (1 - a.traits.foodchain)/total * world.energy;
        });

        var chance = 0.01;
        if(Math.random() < chance){
            world.removeAgentById(world.agents[Math.floor(Math.random() * world.agents.length)].id);
            world.createRandomAgent();
        }

        world.agents.forEach(agent => {
            agent.update(world);
        });
        world.agents.forEach(agent => {
            render.drawAgent(p, agent);
        });
        if(world.agents.length < 10){
            for(var i = 0; i < 10; i++){
                world.createRandomAgent();
            }
        }

    };
};

var myP5 = new p5(sketch);

setInterval(() => {
  writeLog();
}, 200);
setInterval(() => {
  console.log(world);
}, 5000);

function writeLog(){
  var index = {};
  var keys = [];
  world.agents.map(agent => {
    agent.dna.genes.map(gene => {
        count(gene.key, gene.value);
    });
    count('kills', agent.state.kills);
    count('energyChange', agent.state.energyChange);
    count('energy', agent.state.energy);
    count('velX', agent.state.velocity.x);
    count('velY', agent.state.velocity.y);
    if(agent.perceived){
        count('perceived', agent.perceived.agents.length);
        agent.perceived.agents.map(a => {
            count('attraction', a.effects.attraction);
        });
    }
  });
  var str = '';
  str += `<p>Agents: ${world.agents.length}</p>`;
  keys.map(key => {
      if(index[key].count){
          var average = Math.floor(index[key].total/index[key].count * 100)/100;
          str += `<p>${key}: ${average}</p>`;
      }
});
  document.getElementById('ev-log').innerHTML = str;

  function count(key, value){
      if(keys.indexOf(key) === -1){
        keys.push(key);
      }
      index[key] = index[key] || {
        total: 0,
        count: 0
    };
    if(key && value){
        index[key].total += value;
        index[key].count ++;
    }
  }
}
