import {Agent, DNA} from '../evolution';
import p5 from 'p5';
import AgentModel from './model';
var p = new p5();

export function setupWorld(world) {
    world.setupAgent = setupAgent;

    for (let i = 0; i < 50; i++) {
        let dna = new DNA(AgentModel.genes);
        dna.randomize();
        let agent = world.setupAgent(dna);
        world.addAgent(agent);
    }


    function setupAgent(dna) {
        var config = AgentModel;
        var agent = new Agent();
        agent.type = config.type;
        agent.setDNA(dna);
        for (let j = 0; j < config.behaviors.length; j++) {
            agent.addBehavior(config.behaviors[j]);
        }
        agent.state.position = createVector(Math.floor(Math.random() * world.width), Math.floor(Math.random() * world.height));
        agent.state.velocity = createVector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        agent.state.acceleration = createVector(0, 0);
        agent.state.energy = 100;
        agent.state.kills = 0;
        agent.state.hunger = 0;
        return agent;
    }

}
