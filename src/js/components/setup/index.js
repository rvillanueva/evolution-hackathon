import {Agent, DNA} from '../evolution';
import p5 from 'p5';
import {sheep, wolf} from './models';
var p = new p5();

export function setupWorld(world) {
    for (let i = 0; i < 50; i++) {
        let agent = setupAgent(sheep);
        world.addAgent(agent);
    }
    for (let i = 0; i < 2; i++) {
        let agent = setupAgent(wolf);
        world.addAgent(agent);
    }

    function setupAgent(config) {
        var agent = new Agent();
        agent.type = config.type;
        let dna = new DNA(config.genes);
        dna.randomize();
        agent.setDNA(dna);
        for (let j = 0; j < config.behaviors.length; j++) {
            agent.addBehavior(config.behaviors[j]);
        }
        agent.state.position = createVector(Math.floor(Math.random() * world.width), Math.floor(Math.random() * world.height));
        agent.state.velocity = createVector(Math.random() * 10, Math.random() * 10);
        agent.state.acceleration = createVector(0, 0);
        return agent;
    }

}
